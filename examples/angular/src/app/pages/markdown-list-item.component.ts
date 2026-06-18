import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourierInboxComponent, CourierService } from '@trycourier/courier-angular';
import { marked } from 'marked';

@Component({
  selector: 'app-markdown-list-item',
  standalone: true,
  imports: [CommonModule, CourierInboxComponent],
  template: `
    <courier-inbox>
      <ng-template #listItem let-props>
        <div>
          <div [innerHTML]="renderMarkdown(props?.message?.preview)"></div>
        </div>
      </ng-template>
    </courier-inbox>
  `,
})
export class MarkdownListItemComponent implements OnInit {
  constructor(private courier: CourierService) {}

  ngOnInit(): void {
    this.refreshCourierJwt();
  }

  private async refreshCourierJwt(): Promise<void> {
    await new Promise((resolve) => window.setTimeout(resolve, 10));
    this.courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }

  renderMarkdown(preview: string | undefined | null): string {
    return marked.parse(preview ?? '', { async: false }) as string;
  }
}
