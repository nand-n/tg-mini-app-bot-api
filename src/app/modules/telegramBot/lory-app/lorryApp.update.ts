
import { Action, Ctx, Hears, Start, Update } from 'nestjs-telegraf';
import { Markup } from 'telegraf';  
import { Context as TelegrafContext } from 'telegraf';
import { AnnouncementsService } from '../../announcements/announcements.service';
import { TicketsService } from '../../tickets/tickets.service';
import { AssignTicketDto } from '../../tickets/dto/assign-ticket.dto';
import { Announcement } from '../../announcements/entities/announcement.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { ChapaService, InitializeOptions, SplitType } from '../../chapa-sdk';

export interface Context extends TelegrafContext {
  match: RegExpMatchArray;
}

@Update()
export class GreeterUpdate {
  constructor(private readonly announcementsService: AnnouncementsService,
    private readonly ticketsService: TicketsService,
    private readonly chapaService: ChapaService, 
  ) {}
  

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<void> {
    await ctx.telegram.sendMessage(ctx.chat.id, "Welcome! Choose an option below or type a command.", {
      reply_markup: {
        keyboard: [
          [{ text: "Announcements" }, { text: "Lucky Numbers" }],
          [{ text: "My Tickets" }, { text: "Lounch App" ,web_app:{url:"https://lotoapp-nahomdebele002gmailcoms-projects.vercel.app"}}],
        ],
        resize_keyboard: true,  
        one_time_keyboard: true 

      },
    });
  }


  @Hears("Announcements")
  async onAnnouncements(@Ctx() ctx: Context): Promise<void> {
    const announcements = await this.announcementsService.findAllUnclosedAnnoucment();
    const inlineKeyboard: Array<Array<{ text: string, callback_data: string }>> = [];
  
    for (let i = 0; i < announcements.length; i += 2) {
      const row = [
        { text: announcements[i].name, callback_data: `announcement_${announcements[i].id}` }
      ];
      if (i + 1 < announcements.length) {
        row.push({ text: announcements[i + 1].name, callback_data: `announcement_${announcements[i + 1].id}` });
      }
      inlineKeyboard.push(row);
    }
  
    await ctx.telegram.sendMessage(ctx.chat.id, "Here are the lottery announcements...", {
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    });
  }
  @Hears("Closed Announcements")
  async onClosedAnnouncements(@Ctx() ctx: Context): Promise<void> {
    const announcements = await this.announcementsService.findAlllosedAAnnoucment();
    const inlineKeyboard = announcements.map(announcement => {
      return [{ text: announcement.name, callback_data: `announcement_${announcement.id}` }];
    });

    await ctx.telegram.sendMessage(ctx.chat.id, "Here are the closed announcements...", {
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    });
  }


  @Action(/announcement_(.+)/)
  async onAnnouncementDetail(@Ctx() ctx: Context): Promise<void> {
    const announcementId = ctx.match[1];
    const announcement = await this.announcementsService.findOne(announcementId);

    if (!announcement) {
      await ctx.reply("Announcement not found.");
      return;
    }


      // Create ticket buttons with red X for paid tickets
  const ticketButtons = announcement.tickets.map(ticket => 
    ticket.isPayed 
      ? { text: '❌', callback_data: `ticket_unavailable_${ticket.id}` }  // Distinct callback_data for unavailable tickets
      : { text: `${ticket.number}`, callback_data: `ticket_${ticket.id}` }
  );


    // Group buttons into rows of 4
    const inlineKeyboard = [];
    for (let i = 0; i < ticketButtons.length; i += 4) {
      inlineKeyboard.push(ticketButtons.slice(i, i + 4));
    }

    await ctx.telegram.sendMessage(ctx.chat.id, 
      `Announcement: ${announcement.name}\nEnd Date: ${announcement.endDate}\nEnd Time: ${announcement.endTime}\nNumber of Tickets: ${announcement.numberOfTickets}`,
      {
        reply_markup: {
          inline_keyboard: inlineKeyboard
        }
      }
    );
  }
  @Hears("Lucky Numbers")
  async onLuckyNumbers(@Ctx() ctx: Context): Promise<void> {
    try {
      await ctx.reply(`
        <b>Mamesodo Apache 180cc motor ምርት ውጤት (ውጤት code B01) ቀን 27/11/10</b>
  
        <b>➤ 1፡፡ <span style="color: blue; font-size: 1.2em;">2 3 8</span></b>
        0911119734
        Chere ክቡርን 01ተ እንኳን አደረሳህ!
  
        <hr>
  
        <b>➤ 2፡፡ <span style="color: blue; font-size: 1.2em;">1 9 7</span></b>
        0911193868
        Online ከእናት
  
        <hr>
  
        <b>➤ 3፡፡ <span style="color: blue; font-size: 1.2em;">5 4 2</span></b>< >
        0925106919
        Online አርባ
  
        <hr>
  
        <b>➤ 4፡፡ <span style="color: blue; font-size: 1.2em;">3 2 7</span></b>
        0906455052
        Online Hawssa
  
        <hr>
        
        <b>➤ 5፡፡ <span style="color: blue; font-size: 1.2em;">2 2 1</span></b>
        0911792904
        Online ከእናት
  
        <hr>
  
        <span style="font-size: 1.2em;">😍 እንኳን ምርትን እንኳን ደስ አለን!</span>
  
        <span style="color: red; font-weight: bold;">⚠️ ለማረጋገጥ mereja</span>
  
        0910008689

      `);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
  @Hears("My Tickets")
async onMyTickets(@Ctx() ctx: Context): Promise<void> {
  const assignTicketDto = new AssignTicketDto();

  if (ctx.from) {
    assignTicketDto.telegramUser = ctx.from.username;
  }

  const tickets = await this.ticketsService.findAllMyTickets(assignTicketDto);

  if (!tickets.length) {
    await ctx.reply("You have no tickets.");
    return;
  }

  // Group tickets by announcement
  const announcements = new Map<string, { announcement: Announcement, tickets: Ticket[] }>();

  tickets.forEach(ticket => {
    const announcementId = ticket.announcement.id;
    if (!announcements.has(announcementId)) {
      announcements.set(announcementId, { announcement: ticket.announcement, tickets: [] });
    }
    announcements.get(announcementId)?.tickets.push(ticket);
  });

  // Create messages with inline keyboards
  const messages = [];
  announcements.forEach(({ announcement, tickets }) => {
    let message = `Announcement: ${announcement.name}\nEnd Date: ${announcement.endDate}\nEnd Time: ${announcement.endTime}\nNumber of Tickets: ${announcement.numberOfTickets}\n\n`;

    // Add tickets and buttons
    const inlineKeyboard = [];
    tickets.forEach(ticket => {
      message += `Ticket Number: ${ticket.number} - Is Paid: ${ticket.isPayed ? 'Yes' : 'No'}\n`;
      
      if (!ticket.isPayed) {
        inlineKeyboard.push([
          Markup.button.callback(`Pay Now ${ticket.number}`, `pay_${ticket.id}`)
        ]);
      }
    });

    messages.push({ message, inlineKeyboard });
  });

  // Send messages
  for (const { message, inlineKeyboard } of messages) {
    await ctx.telegram.sendMessage(ctx.chat.id, message, {
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    });
  }
}

@Action(/ticket_unavailable_(.+)/)
async onTicketUnavailable(@Ctx() ctx: Context): Promise<void> {
  const ticketId = ctx.match[1];

  await ctx.reply("The selected ticket is unavailable. Please select another ticket.");
}

@Action(/ticket_(.+)/)
async onTicketDetail(@Ctx() ctx: Context): Promise<void> {
  const ticketId = ctx.match[1];

  const assignTicketDto = new AssignTicketDto();

  if (ctx.from) {
    assignTicketDto.telegramUser = ctx.from.username;
  }


  const ticket = await this.ticketsService.findOne(ticketId);

  await this.ticketsService.assignTicket(ticketId, assignTicketDto);
  await ctx.reply(
    `You have selected ticket number 🎟️ ${ticket?.number} from the lottery announcement " ${ticket?.announcement?.name} ".\n\n` +
    `Price ${ticket?.ticketPrice} ETB. \n`+
    `You can choose to pay now or later.\n` +
    `💡 *Disclaimer:* While you haven't paid for this ticket, it remains available for purchase by others.`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: `Pay ${ticket.ticketPrice} ETB Now`, callback_data: `pay_${ticketId}` },
            { text: 'Pay Later', callback_data: `paylater_${ticketId}` }
          ]
        ]
      },
      parse_mode: 'Markdown' 
    }
  );
}

  @Action(/pay_(.+)/)
  async onPayTicket(@Ctx() ctx: Context): Promise<void> {
    const ticketId = ctx.match[1];
    const ticket = await this.ticketsService.findOne(ticketId);

    if (!ticket) {
      await ctx.reply('Ticket not found.');
      return;
    }

    const ticketRef = `ticket_${ticketId}${Date.now()}`
    const initializeOptions: InitializeOptions = {
      first_name:ctx.from.first_name,
      last_name:ctx.from.username,
      amount: `${ticket?.ticketPrice}`, 
      currency: 'ETB',
      tx_ref: ticketRef,
      phone_number:"0937108836",
      subaccounts:[
        {
          id:'1',
          split_type:SplitType.PERCENTAGE,
          transaction_charge:5
        }
      ],
      customization:{
        title:"Mame Sodo Equb",
        description:"You are paying for mame sodo Apache B2 Equb lotory",
        logo:"https://images-platform.99static.com/eeT6XCZNJPVeYsVW-ESX45i7CbU=/123x157:1323x1357/500x500/top/smart/99designs-contests-attachments/89/89205/attachment_89205299"
      }
      // callback_url: 'http://0.0.0.0:3000/payments/verify', 
      // return_url:`http://localhost:3000/payments/verify/${ticketRef}`
    };
    try {
      const { checkout_url } = await this.chapaService.initialize(initializeOptions);
      await ctx.reply('Please complete your payment by clicking the button below.', {
        reply_markup: {
          inline_keyboard: [[
            {
              text: 'Complate Payment - Checkout',
              web_app: { url: checkout_url.checkout_url }
            }

          ]]
        }
      });

    } catch (error) {
      console.error('Payment request failed:', error);
      await ctx.reply('Failed to initiate payment. Please try again later.');
    }
  }
  
  @Action(/paylater_(.+)/)
async onPayLater(@Ctx() ctx: Context): Promise<void> {
  const ticketId = ctx.match[1];

  // Inform the user about the "Pay Later" option and how to pay later
  await ctx.reply(
    `You have chosen to pay later for ticket number 🎟️ ${ticketId}.\n\n` +
    `🕒 *You can pay for this ticket later by clicking on the "My Tickets" option.*\n` +
    `📜 In "My Tickets", you'll find a list of your selected tickets with the option to pay now or later. Simply select the ticket you want to pay for and choose "Pay Now".\n\n` +
    `If you have any questions or need assistance, feel free to ask!`,
    {
      parse_mode: 'Markdown' 
    }
  );
}

}


