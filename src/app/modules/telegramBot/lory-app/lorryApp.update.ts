
import { Action, Ctx, Hears, Start, Update } from 'nestjs-telegraf';
import { Markup } from 'telegraf';  
import { Context as TelegrafContext } from 'telegraf';
import { AnnouncementsService } from '../../announcements/announcements.service';
import { TicketsService } from '../../tickets/tickets.service';
import { AssignTicketDto } from '../../tickets/dto/assign-ticket.dto';
import { Announcement } from '../../announcements/entities/announcement.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { ChapaService, InitializeOptions } from '../../chapa-sdk';

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
          [{ text: "Announcements" }],
          [{ text: "Closed Announcements" }],
          [{ text: "My Tickets" }]

        ],
        resize_keyboard: true,  
        one_time_keyboard: true 
      }
    });
  }

  @Hears("Announcements")
  async onAnnouncements(@Ctx() ctx: Context): Promise<void> {
    const announcements = await this.announcementsService.findAllUnclosedAnnoucment();
    const inlineKeyboard = announcements.map(announcement => {
      return [{ text: announcement.name, callback_data: `announcement_${announcement.id}` }];
    });

    await ctx.telegram.sendMessage(ctx.chat.id, "Here are the announcements...", {
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

    // Create ticket buttons
    const ticketButtons = announcement.tickets.map(ticket => ({
      text: `${ticket.number}`,
      callback_data: `ticket_${ticket.id}`
    }));

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

  @Action(/ticket_(.+)/)
  async onTicketDetail(@Ctx() ctx: Context): Promise<void> {
    const ticketId = ctx.match[1];

    const assignTicketDto = new AssignTicketDto();

    if (ctx.from) {
      assignTicketDto.telegramUser = ctx.from.username;
    }

    await this.ticketsService.assignTicket(ticketId, assignTicketDto);
    await ctx.reply(`Ticket details for ID: ${ticketId}`);
  }
  @Action(/pay_(.+)/)
  async onPayTicket(@Ctx() ctx: Context): Promise<void> {
    const ticketId = ctx.match[1];
    const ticket = await this.ticketsService.findOne(ticketId);

    if (!ticket) {
      await ctx.reply('Ticket not found.');
      return;
    }

    const initializeOptions: InitializeOptions = {
      first_name:ctx.from.first_name,
      last_name:ctx.from.username,
      amount: "1000", 
      currency: 'ETB',
      tx_ref: `ticket_${ticketId}`,
      // callback_url: 'http://localhost:3000.com/payments/verify', 
    };

    try {
      const { payment_url } = await this.chapaService.initialize(initializeOptions);
      await ctx.reply(`Please complete your payment by clicking the link below:\n${payment_url}`);
    } catch (error) {
      console.error('Payment request failed:', error);
      await ctx.reply('Failed to initiate payment. Please try again later.');
    }
  }
}



