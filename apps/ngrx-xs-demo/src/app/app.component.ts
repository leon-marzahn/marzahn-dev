import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'marzahn-dev-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}
