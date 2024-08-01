import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from "@nestjs/common";
import {
  ChapaService,
  CreateSubaccountOptions,
  InitializeOptions,
  VerifyOptions,
} from "src/app/modules/chapa-sdk";

@Controller("payment")
export class PaymentController {
  constructor(private readonly chapaService: ChapaService) {}

  @Post("initialize/:userId/purchase/:bookId")
  async initialize(
    @Body() initializeOptions: InitializeOptions,
    @Param("userId") userId: string,
    @Param("bookId") bookId: string,
  ) {
    const tx_ref = await this.chapaService.generateTransactionReference();
    return this.chapaService.initialize({
      ...initializeOptions,
      tx_ref,
      userId,
      bookId,
    });
  }

  
  @Get("verify/:tx_ref")
  verify(@Param() verifyOptions: VerifyOptions) {
    return this.chapaService.verify(verifyOptions);
  }

  @Post("subaccount")
  createSubaccount(@Body() createSubaccountOptions: CreateSubaccountOptions) {
    return this.chapaService.createSubaccount(createSubaccountOptions);
  }
  @Get("get-banks")
  getBanks() {
    return this.chapaService.getBanks();
  }

  @Post("mobile-initialize")
  initializeMobile(@Body() initializeMobile: InitializeOptions) {
    return this.chapaService.mobileInitialize(initializeMobile);
  }
}
