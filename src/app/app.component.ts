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
      window.electron.navigate((route: string) => {
        this.ngZone.run(() => {
          if (this.router.url === route) {
            // Force reload when navigating to the same route
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
    }
  }
}
