import { HttpService } from "@nestjs/axios";
import {
  Injectable,
  Inject,
  HttpException,
  BadRequestException,
  HttpStatus,
} from "@nestjs/common";
// import { alphanumeric } from "nanoid-dictionary";
import { CHAPA_OPTIONS } from "./constants";
import { v4 as uuidv4 } from "uuid";
import { ChapaUrls } from "./enums";
import {
  ChapaOptions,
  CreateSubaccountOptions,
  CreateSubaccountResponse,
  GenerateTransactionReferenceOptions,
  GetBanksResponse,
  InitializeOptions,
  InitializeResponse,
  VerifyOptions,
  VerifyResponse,
} from "./interfaces";
import {
  validateCreateSubaccountOptions,
  validateInitializeOptions,
  validateVerifyOptions,
} from "./validations";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Payment } from "../payment/entities/payment.entity";
// import { customAlphabet } from "nanoid";

/**
 * Interface for ChapaService
 *
 *
 *
 */
interface IChapaService {
  initialize(initializeOptions: InitializeOptions): Promise<InitializeResponse>;
  mobileInitialize(
    initializeOptions: InitializeOptions,
  ): Promise<InitializeResponse>;
  verify(verifyOptions: VerifyOptions): Promise<VerifyResponse>;
  generateTransactionReference(
    generateTransactionReferenceOptions?: GenerateTransactionReferenceOptions,
  ): Promise<string>;
  getBanks(): Promise<GetBanksResponse>;
  createSubaccount(
    createSubaccountOptions: CreateSubaccountOptions,
  ): Promise<CreateSubaccountResponse>;
}

@Injectable()
/**
 *
 *  The only thing you need to leave intact is the `@Inject(CHAPA_OPTIONS) private chapaOptions`.
 *
 *  That injected dependency gives you access to the options passed in to
 *  ChapaService.
 *
 */
export class ChapaService implements IChapaService {
  constructor(
    @Inject(CHAPA_OPTIONS) private chapaOptions: ChapaOptions,
    private readonly httpService: HttpService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async initialize(initializeOptions: InitializeOptions): Promise<any> {
    try {
      await validateInitializeOptions(initializeOptions);
      const user = await this.userRepository.findOne({
        where: { id: initializeOptions?.userId },
      });
      const responseData: any = {};
      const response = await this.httpService.axiosRef.post<InitializeResponse>(
        ChapaUrls.INITIALIZE,

        initializeOptions,

        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        },
      );
      if (response.status) {
        let purchase = await this.paymentRepository
          .createQueryBuilder("payment")
          .where("payment.user = :userId", { userId: initializeOptions.userId })
          .getOne();
        if (purchase) {
          purchase.user = user;
          // purchase.book = book;
          purchase.tx_ref = initializeOptions.tx_ref;
          purchase.payment_date = new Date();
          // purchase.amount = parseFloat(book.price.toString());
          purchase.payment_method = "Direct";
          await this.paymentRepository.update(purchase.id, purchase);
          const purchased = await this.paymentRepository.save(purchase);

          if (purchased) {
            const populatedPurchase = await this.paymentRepository
              .createQueryBuilder("payment")
              .where("payment.id = :id", { id: purchased.id })
              .getOne();
            responseData.purchased = { ...populatedPurchase };
          }
        } else {
          const purchase = new Payment();
          purchase.user = user;
          purchase.tx_ref = initializeOptions.tx_ref;
          purchase.payment_date = new Date();
          purchase.payment_method = "Direct";

          const purchased = await this.paymentRepository.save(purchase);
          if (purchased) {
            const populatedPurchase = await this.paymentRepository
              .createQueryBuilder("payment")
              .where("payment.id = :id", { id: purchased.id })
              .getOne();
            responseData.purchased = { ...populatedPurchase };
          }
          responseData.checkout_url = response.data.data;

          return responseData;
        }
        responseData.checkout_url = response.data.data;

        return responseData;
      }
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else if (error.name === "ValidationError") {
        throw new HttpException(error.errors[0], HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async mobileInitialize(
    initializeOptions: InitializeOptions,
  ): Promise<InitializeResponse> {
    try {
      await validateInitializeOptions(initializeOptions);

      const response = await this.httpService.axiosRef.post<InitializeResponse>(
        ChapaUrls.MOBILE_INITIALIZE,
        initializeOptions,
        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else if (error.name === "ValidationError") {
        throw new BadRequestException(error.errors[0]);
      } else {
        throw error;
      }
    }
  }

  async verify(verifyOptions: VerifyOptions): Promise<any> {
    try {
      await validateVerifyOptions(verifyOptions);
      const response = await this.httpService.axiosRef.get<VerifyResponse>(
        `${ChapaUrls.VERIFY}/${verifyOptions.tx_ref}`,
        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        },
      );
      const payment = await this.paymentRepository.findOne({
        where: { tx_ref: response.data.data.tx_ref },
      });
      if (payment.status == "PENDING") {
        payment.status = "COMPLETED";
        await this.paymentRepository.update(payment.id, payment);
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else if (error.name === "ValidationError") {
        throw new BadRequestException(error.errors[0]);
      } else {
        throw error;
      }
    }
  }

  async generateTransactionReference(
    generateTransactionReferenceOptions?: GenerateTransactionReferenceOptions,
  ): Promise<string> {
    const prefix =
      generateTransactionReferenceOptions &&
      generateTransactionReferenceOptions.prefix
        ? generateTransactionReferenceOptions.prefix
        : "TX";
    const size =
      generateTransactionReferenceOptions &&
      generateTransactionReferenceOptions.size
        ? generateTransactionReferenceOptions.size
        : 15;
    // const nanoid = customAlphabet(alphanumeric, size);
    // const reference = await nanoid();
    const uuid = uuidv4();
    const reference = uuid.replace(/-/g, "").substring(0, size);

    return `${prefix}-${reference.toUpperCase()}`;
  }

  async getBanks(): Promise<GetBanksResponse> {
    try {
      const banks = await this.httpService.axiosRef.get<GetBanksResponse>(
        ChapaUrls.BANKS,
        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        },
      );
      return banks.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else {
        throw error;
      }
    }
  }

  async createSubaccount(
    createSubaccountOptions: CreateSubaccountOptions,
  ): Promise<CreateSubaccountResponse> {
    try {
      await validateCreateSubaccountOptions(createSubaccountOptions);
      const response =
        await this.httpService.axiosRef.post<CreateSubaccountResponse>(
          ChapaUrls.SUBACCOUNT,
          createSubaccountOptions,
          {
            headers: {
              Authorization: `Bearer ${this.chapaOptions.secretKey}`,
            },
          },
        );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else if (error.name === "ValidationError") {
        throw new BadRequestException(error.errors[0]);
      } else {
        throw error;
      }
    }
  }
}
