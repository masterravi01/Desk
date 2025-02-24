import { Component, NgZone } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

declare const window: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-ang';


  constructor(private router: Router, private ngZone: NgZone) {
    if ((window as any).electron) {
      (window as any).electron.navigate((route: string) => {
        this.ngZone.run(() => {
          this.router.navigateByUrl(route);
        });
      });
    }
  }
}
