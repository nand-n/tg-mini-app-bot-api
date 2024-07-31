import { Command, Ctx, Hears, Start, Update, Sender  } from 'nestjs-telegraf';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';
import { UpdateType } from '@root/src/core/decorators/update-type.decorators';
import { Context } from '@root/src/core/interfaces/botContext.interface';
import { HELLO_SCENE_ID, WIZARD_SCENE_ID } from '../constants';

@Update()
export class GreeterUpdate {
  @Start()
  onStart(): string {
    return 'Say hello to me';
  }

  @Hears(['hi', 'hello', 'hey', 'qq'])
  onGreetings(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
  ): string {
    return `Hey ${firstName}`;
  }

  @Command('scene')
  async onSceneCommand(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(HELLO_SCENE_ID);
  }

  @Command('wizard')
  async onWizardCommand(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(WIZARD_SCENE_ID);
  }
}


// import { Command, Ctx, Hears, Start, Update, Sender } from 'nestjs-telegraf';
// import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';
// import { UpdateType } from '@root/src/core/decorators/update-type.decorators';
// import { Context } from '@root/src/core/interfaces/botContext.interface';
// import { HELLO_SCENE_ID, WIZARD_SCENE_ID } from '../constants';

// @Update()
// export class GreeterUpdate {
//   @Start()
//   onStart(): string {
//     return 'Say hello to me';
//   }

//   @Hears(['hi', 'hello', 'hey', 'qq'])
//   onGreetings(
//     @UpdateType() updateType: TelegrafUpdateType,
//     @Sender('first_name') firstName: string,
//   ): string {
//     return `Hey ${firstName}`;
//   }

//   @Command('scene')
//   async onSceneCommand(@Ctx() ctx: Context): Promise<void> {
//     await ctx.scene.enter(HELLO_SCENE_ID);
//     await ctx.telegram.sendMessage(ctx.chat.id, "Please click on the button below.", {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "Yes",
//               callback_data: "btn_yes"
//             },
//             {
//               text: "No",
//               callback_data: "btn_no"
//             }
//           ]
//         ]
//       }
//     });
//   }

//   @Command('wizard')
//   async onWizardCommand(@Ctx() ctx: Context): Promise<void> {
//     await ctx.scene.enter(WIZARD_SCENE_ID);
//     await ctx.telegram.sendMessage(ctx.chat.id, "Please click on the button below.", {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "Yes",
//               callback_data: "btn_yes"
//             },
//             {
//               text: "No",
//               callback_data: "btn_no"
//             }
//           ]
//         ]
//       }
//     });
//   }
// }


// import { Command, Ctx, Hears, Start, Update } from 'nestjs-telegraf';
// import { Context } from '@root/src/core/interfaces/botContext.interface';
// import { CallbackQuery } from 'telegraf/typings/core/types/typegram';
// import { UpdateType } from '@root/src/core/decorators/update-type.decorators';

// @Update()
// export class GreeterUpdate {
//   @Start()
//   async onStart(@Ctx() ctx: Context): Promise<void> {
//     await ctx.telegram.sendMessage(ctx.chat.id, "Welcome! Click the button below to start.", {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "Start",
//               callback_data: "start_btn"
//             }
//           ]
//         ]
//       }
//     });
//   }

//   @Hears(['hi', 'hello', 'hey', 'qq'])
//   onGreetings(@Ctx() ctx: Context): string {
//     const firstName = ctx.from?.first_name || 'Guest';
//     return `Hey ${firstName}`;
//   }

//   @Command('scene')
//   async onSceneCommand(@Ctx() ctx: Context): Promise<void> {
//     await ctx.scene.enter('HELLO_SCENE_ID');
//   }

//   @Command('wizard')
//   async onWizardCommand(@Ctx() ctx: Context): Promise<void> {
//     await ctx.scene.enter('WIZARD_SCENE_ID');
//   }


//   async onCallbackQuery(@Ctx() ctx: Context, @UpdateType() updateType: string): Promise<void> {
//     const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
//     const data = callbackQuery?.data;

//     if (updateType === 'callback_query') {
//       if (data === 'start_btn') {
//         await ctx.telegram.sendMessage(ctx.chat.id, "Welcome to Lori App! Choose an option:", {
//           reply_markup: {
//             inline_keyboard: [
//               [
//                 { text: "Announcements", callback_data: "announcements" },
//                 { text: "Closed Announcements", callback_data: "closed_announcements" }
//               ]
//             ]
//           }
//         });
//       } else if (data === 'announcements') {
//         await this.sendAnnouncements(ctx);
//       } else if (data && data.startsWith('announcement_')) {
//         const announcementId = data.split('_')[1];
//         await this.sendTickets(ctx, announcementId);
//       }
//     }
//   }

//   async sendAnnouncements(@Ctx() ctx: Context): Promise<void> {
//     await ctx.telegram.sendMessage(ctx.chat.id, "Announcements:", {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             { text: "Announcement 1", callback_data: "announcement_1" },
//             { text: "Announcement 2", callback_data: "announcement_2" }
//           ],
//           [
//             { text: "Announcement 3", callback_data: "announcement_3" },
//             { text: "Announcement 4", callback_data: "announcement_4" }
//           ]
//         ]
//       }
//     });
//   }

//   async sendTickets(@Ctx() ctx: Context, announcementId: string): Promise<void> {
//     const numberOfTickets = 20;
//     const tickets = Array.from({ length: numberOfTickets }, (_, i) => (i + 1).toString());

//     const inlineKeyboard = tickets.map(ticket => [{ text: ticket, callback_data: `ticket_${ticket}` }]);

//     await ctx.telegram.sendMessage(ctx.chat.id, `Announcement ${announcementId} - Choose a number:`, {
//       reply_markup: {
//         inline_keyboard: inlineKeyboard
//       }
//     });
//   }
// }


// import { Command, Ctx, Hears, Start, Update } from 'nestjs-telegraf';
// import { Context } from '@root/src/core/interfaces/botContext.interface';
// import { CallbackQuery } from 'telegraf/typings/core/types/typegram';
// import { UpdateType } from '@root/src/core/decorators/update-type.decorators';

// @Update()
// export class GreeterUpdate {
//   @Start()
//   async onStart(@Ctx() ctx: Context): Promise<void> {
//     await ctx.telegram.sendMessage(ctx.chat.id, "Welcome! Click the button below to start.", {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "Start",
//               callback_data: "start_btn"
//             }
//           ]
//         ]
//       }
//     });
//   }

//   @Hears(['hi', 'hello', 'hey', 'qq'])
//   onGreetings(@Ctx() ctx: Context): string {
//     const firstName = ctx.from?.first_name || 'Guest';
//     return `Hey ${firstName}`;
//   }

//   @Command('scene')
//   async onSceneCommand(@Ctx() ctx: Context): Promise<void> {
//     await ctx.scene.enter('HELLO_SCENE_ID');
//   }

//   @Command('wizard')
//   async onWizardCommand(@Ctx() ctx: Context): Promise<void> {
//     await ctx.scene.enter('WIZARD_SCENE_ID');
//   }

//   async onCallbackQuery(@Ctx() ctx: Context, @UpdateType() updateType: string): Promise<void> {
//     console.log('Callback query received:', ctx.callbackQuery);
//     const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
//     const data = callbackQuery?.data;

//     if (updateType === 'callback_query' && data) {
//       console.log('Callback data:', data);

//       if (data === 'start_btn') {
//         console.log('Start button clicked');
//         await ctx.telegram.sendMessage(ctx.chat.id, "Welcome to Lori App! Choose an option:", {
//           reply_markup: {
//             inline_keyboard: [
//               [
//                 { text: "Announcements", callback_data: "announcements" },
//                 { text: "Closed Announcements", callback_data: "closed_announcements" }
//               ]
//             ]
//           }
//         });
//       } else if (data === 'announcements') {
//         await this.sendAnnouncements(ctx);
//       } else if (data.startsWith('announcement_')) {
//         const announcementId = data.split('_')[1];
//         await this.sendTickets(ctx, announcementId);
//       }
//     }
//   }

//   async sendAnnouncements(@Ctx() ctx: Context): Promise<void> {
//     await ctx.telegram.sendMessage(ctx.chat.id, "Announcements:", {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             { text: "Announcement 1", callback_data: "announcement_1" },
//             { text: "Announcement 2", callback_data: "announcement_2" }
//           ],
//           [
//             { text: "Announcement 3", callback_data: "announcement_3" },
//             { text: "Announcement 4", callback_data: "announcement_4" }
//           ]
//         ]
//       }
//     });
//   }

//   async sendTickets(@Ctx() ctx: Context, announcementId: string): Promise<void> {
//     const numberOfTickets = 20;
//     const tickets = Array.from({ length: numberOfTickets }, (_, i) => (i + 1).toString());

//     const inlineKeyboard = tickets.map(ticket => [{ text: ticket, callback_data: `ticket_${ticket}` }]);

//     await ctx.telegram.sendMessage(ctx.chat.id, `Announcement ${announcementId} - Choose a number:`, {
//       reply_markup: {
//         inline_keyboard: inlineKeyboard
//       }
//     });
//   }
// }


// import { Command, Ctx, Hears, Start, Update } from 'nestjs-telegraf';
// import { Context } from '@root/src/core/interfaces/botContext.interface';

// @Update()
// export class GreeterUpdate {
//   @Start()
//   async onStart(@Ctx() ctx: Context): Promise<void> {
//     await ctx.telegram.sendMessage(ctx.chat.id, "Welcome! Choose an option below or type a command.", {
//       reply_markup: {
//         keyboard: [
//           [{ text: "Announcements" }],
//           [{ text: "Closed Announcements" }]
//         ],
//         resize_keyboard: true,  // Makes the keyboard size appropriate to the user's device
//         one_time_keyboard: true // Hides the keyboard after a button is pressed
//       }
//     });
//   }

//   @Hears("Announcements")
//   async onAnnouncements(@Ctx() ctx: Context): Promise<void> {
//     await ctx.telegram.sendMessage(ctx.chat.id, "Here are the announcements...", {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             { text: "Announcement 1", callback_data: "announcement_1" },
//             { text: "Announcement 2", callback_data: "announcement_2" }
//           ],
//           [
//             { text: "Announcement 3", callback_data: "announcement_3" },
//             { text: "Announcement 4", callback_data: "announcement_4" }
//           ]
//         ]
//       }
//     });
//   }

//   @Hears("Closed Announcements")
//   async onClosedAnnouncements(@Ctx() ctx: Context): Promise<void> {
//     await ctx.telegram.sendMessage(ctx.chat.id, "Here are the closed announcements...");
//   }
// }

// import { Command, Ctx, Hears, Start, Update } from 'nestjs-telegraf';
// import { Context } from '@root/src/core/interfaces/botContext.interface';

// @Update()
// export class GreeterUpdate {
//   @Start()
//   async onStart(@Ctx() ctx: Context): Promise<void> {
//     await ctx.telegram.sendMessage(ctx.chat.id, "Welcome! Do you want to continue?", {
//       reply_markup: {
//         inline_keyboard: [
//           [{ text: "Yes", callback_data: "yes" }, { text: "No", callback_data: "no" }]
//         ]
//       }
//     });
//   }

//   @Command('ask')
//   async onAsk(@Ctx() ctx: Context): Promise<void> {
//     await ctx.telegram.sendMessage(ctx.chat.id, "What is your name?", {
//       reply_markup: {
//         force_reply: true
//       }
//     });
//   }

//   @Hears("Yes")
//   async onYes(@Ctx() ctx: Context): Promise<void> {
//     await ctx.telegram.sendMessage(ctx.chat.id, "Great! You chose yes.");
//   }

//   @Hears("No")
//   async onNo(@Ctx() ctx: Context): Promise<void> {
//     await ctx.telegram.sendMessage(ctx.chat.id, "You chose no.");
//   }
// }



// import { Command, Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
// import { Context } from '@root/src/core/interfaces/botContext.interface';
// import { CallbackQuery } from 'telegraf/typings/core/types/typegram';

// @Update()
// export class GreeterUpdate {
//   @Start()
//   async onStart(@Ctx() ctx: Context): Promise<void> {
//     await ctx.telegram.sendMessage(ctx.chat.id, "Welcome! Choose an option below or type a command.", {
//       reply_markup: {
//         keyboard: [
//           [{ text: "Announcements" }],
//           [{ text: "Closed Announcements" }]
//         ],
//         resize_keyboard: true,  // Adjust keyboard size for the device
//         one_time_keyboard: true // Keyboard hides after use
//       }
//     });
//   }

//   @Hears("Announcements")
//   async onAnnouncements(@Ctx() ctx: Context): Promise<void> {
//     await ctx.telegram.sendMessage(ctx.chat.id, "Here are the announcements:", {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             { text: "Announcement 1", callback_data: "announcement_1" },
//             { text: "Announcement 2", callback_data: "announcement_2" }
//           ],
//           [
//             { text: "Announcement 3", callback_data: "announcement_3" },
//             { text: "Announcement 4", callback_data: "announcement_4" }
//           ]
//         ]
//       }
//     });
//   }

//   @Hears("Closed Announcements")
//   async onClosedAnnouncements(@Ctx() ctx: Context): Promise<void> {
//     await ctx.telegram.sendMessage(ctx.chat.id, "Here are the closed announcements.");
//   }
//   @On('callback_query')
//   async onCallbackQuery(@Ctx() ctx: Context): Promise<void> {
//     const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
//     const data = callbackQuery?.data;

//     if (data) {
//       if (data.startsWith('announcement_')) {
//         const announcementId = data.split('_')[1];
//         await this.sendTickets(ctx, announcementId);
//       }
//     }
//   }

//   async sendTickets(@Ctx() ctx: Context, announcementId: string): Promise<void> {
//     const numberOfTickets = 20;
//     const tickets = Array.from({ length: numberOfTickets }, (_, i) => (i + 1).toString());

//     const inlineKeyboard = tickets.map(ticket => [{ text: ticket, callback_data: `ticket_${ticket}` }]);

//     await ctx.telegram.sendMessage(ctx.chat.id, `Announcement ${announcementId} - Choose a number:`, {
//       reply_markup: {
//         inline_keyboard: inlineKeyboard
//       }
//     });

//   }
// }
