import { Component, OnInit } from '@angular/core';
import { CourierInboxComponent, CourierService } from '@trycourier/courier-angular';

@Component({
  selector: 'app-custom-other',
  standalone: true,
  imports: [CourierInboxComponent],
  template: `
    <courier-inbox>
      <ng-template #loadingState>
        <div style="width: 100%; padding: 24px; background: red; text-align: center;">
          Custom Loading State
        </div>
      </ng-template>

      <ng-template #emptyState>
        <div style="width: 100%; padding: 24px; background: green; text-align: center;">
          Custom Empty State
        </div>
      </ng-template>

      <ng-template #errorState let-props>
        <div style="width: 100%; padding: 24px; background: blue; text-align: center;">
          Custom Error State: {{ props?.error?.message }}
        </div>
      </ng-template>

      <ng-template #paginationItem>
        <div style="padding: 24px; background: yellow; text-align: center;">
          Custom Pagination Item
        </div>
      </ng-template>
    </courier-inbox>
  `,
})
export class CustomOtherComponent implements OnInit {
  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }
}
