import {Inngest} from "inngest";
import {serve} from "inngest/next";
// import {ServerClient} from 'postmark'

// Create a client to send and receive events
export const inngest = new Inngest<Events>({name: "App", eventKey: process.env.INNGEST_SIGNING_KEY});

type GuestCreateEvent = {
  name: 'quote/guest.created'
  data: {
    stAddress: string
    email: string
    houseId: string
  }
}

type Events = {
  'quote/guest.created': GuestCreateEvent
}

const handleGuestQuoteCreate = inngest.createFunction(
  {name: 'Guest created a quote'},
  {event: 'quote/guest.created'},
  async ({ event, step }) => {

    await step.run("Send confirmation email", () => {
      // const client = new ServerClient(process.env.POSTMARK_KEY);
      // await client.sendEmail({
      //   "From": "system@pruned.com",
      //   "To": event.data.email,
      //   "Subject": `Order received for ${event.data.stAddress}`,
      //   "HtmlBody": `<strong>We have received your order.</strong> One of our attractive client specialists will reach out to you shortly with next steps. You can view your quote at <link>http://localhost:3000/house/${event.data.houseId}</link>`,
      //   "TextBody": `We have received your order for ${event.data.stAddress}`,
      //   "MessageStream": "outbound"
      // });
      console.log('Send email to: ', event.data.email);
      return { msg: 'success' }
    });

    await step.run("Send admin notification email", () => {
      // const client = new ServerClient(process.env.POSTMARK_KEY);
      // await client.sendEmail({
      //   "From": "system@pruned.com",
      //   "To": "sales@pruned.com",
      //   "Subject": `New lead - ${event.data.stAddress}`,
      //   "HtmlBody": `View lead info at pruned.com/${event.data.houseId}`,
      //   "TextBody": `New lead - ${event.data.stAddress}`,
      //   "MessageStream": "outbound"
      // })
      return { msg: 'success' }
    });

    await step.run("Import deal to CRM", async () => {
      // Send a request to CRM API to track this quote and customer for sales/support usage.
    })
  }
);
export default serve(inngest, [handleGuestQuoteCreate]);