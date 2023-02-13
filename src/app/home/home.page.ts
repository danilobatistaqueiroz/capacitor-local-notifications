import { Component, OnInit } from '@angular/core';
import { ActionPerformed, LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private alertCtrl: AlertController) {}

  async ngOnInit() {
    console.log('ok');
    
    await LocalNotifications.requestPermissions();
    LocalNotifications.registerActionTypes({
      types:[
        {
          id: 'CHAT_MSG',   
          actions:[
            // {
            //   id:'view',
            //   title:'OpenChat'
            // },
            {
              id: 'remove',
              title: 'Dismiss',
              destructive: true
            },
            {         
              id: 'respond',
              title: 'Respond',
              input: true
            },
            {
              id:'fore',
              title:'foreground',
              foreground: true
            }
          ]
        }
      ]
    });

    LocalNotifications.addListener('localNotificationReceived',(notification: LocalNotificationSchema)=>{
      console.log('a');
      this.presentAlert(`Received: ${notification.id}`,`Custom Data: ${JSON.stringify(notification.extra)}`);
      console.log(notification.id);
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (notification:ActionPerformed)=>{
      console.log('b');
      this.presentAlert(`Performed: ${notification.actionId}`, `Input value:${notification.inputValue}`);
    });
  }

  async scheduleBasic() {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Friendly Reminder',
          body: 'Join the Ionic Academy',
          largeBody: `and learn a lot more
          `,
          id: 1,
          extra: {
            data: 'Pass data to your handler'
          },
          iconColor: '#0000FF'
        }
      ]
    })
  }

  async scheduleAdvanced() {
    await LocalNotifications.schedule({
      notifications:[
        {
          title: 'Basic Reminder',
          body: 'A pop up in instant',
          id:3,
         // sound:null,
          extra:{
            data: 'Pass data to your handler'
          },
          iconColor: '#0000ff',
          actionTypeId:'CHAT_MSG',
          schedule:{
            //  at: new Date(Date.now()+1000*3),
            // repeats:true,
            // every:'minute',
             count:5,
            // on: {
            //   minute: 5
            // }
          }
        }
      ]
    });
  }

  async presentAlert(header:string, message:string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
