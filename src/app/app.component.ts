import { Component, NgZone } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';

declare const window: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'alfa';

  constructor(private router: Router, private ngZone: NgZone) {
    if (window.electron) {
      // 🚀 Navigation
      window.electron.navigate((route: string) => {
        this.ngZone.run(() => {
          if (this.router.url === route) {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigateByUrl(route);
              });
          } else {
            this.router.navigateByUrl(route);
          }
        });
      });

      // 🔄 Auto Update Events
      window.electron.onUpdateAvailable(() => {
        alert('A new update is available. Downloading...');
      });

      window.electron.onUpdateDownloaded(() => {
        console.log('[Angular] Inside update_downloaded handler');
        const confirmInstall = confirm(
          'Update downloaded. Do you want to restart and install now?'
        );
        if (confirmInstall) {
          window.electron.invoke('install_update');
        }
      });
    }
  }
}
