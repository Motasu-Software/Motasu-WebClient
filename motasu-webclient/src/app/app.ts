import { Component, signal, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('motasu-webclient');

  constructor() {
    afterNextRender(() => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (prefersDark) {
        document.body.classList.add('dark-theme');
      }
    });
  }
}