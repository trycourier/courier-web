import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  // The app shell simply renders the active route.
  template: '<router-outlet />',
})
export class AppComponent {}
