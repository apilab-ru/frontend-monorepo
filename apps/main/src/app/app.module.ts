import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PageComponent } from './pages/page/page.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { AboutComponent } from './components/about/about.component';
import { TitleComponent } from './components/title/title.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FooterComponent } from './components/footer/footer.component';
import { SvgZigzagComponent } from './components/svg-zigzag/svg-zigzag.component';
import { ItemWorkComponent } from './components/item-work/item-work.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { ItemFeedbackComponent } from './components/item-feedback/item-feedback.component';
import { ModalProjectComponent } from './components/modal-project/modal-project.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { TRANSLOCO_CONFIG, TranslocoModule } from '@ngneat/transloco';
import { TranslocoMessageFormatModule } from '@ngneat/transloco-messageformat';
import { LinkDirective } from './directives/link.directive';
import localeRu from '@angular/common/locales/ru';
import { DatePipe, registerLocaleData } from '@angular/common';
import { AppDatePipe } from './pipes/date.pipe';

registerLocaleData(localeRu, 'ru-RU');

const ROUTES: Routes = [
  {
    path: 'ru',
    component: PageComponent,
    data: { lang: 'ru' },
  },
  {
    path: 'en',
    component: PageComponent,
    data: { lang: 'en' }
  },
  {
    path: '**',
    redirectTo: 'ru',
  },
];

@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    HeaderComponent,
    MenuComponent,
    AboutComponent,
    TitleComponent,
    SkillsComponent,
    ExperienceComponent,
    PortfolioComponent,
    FeedbackComponent,
    FooterComponent,
    SvgZigzagComponent,
    ItemWorkComponent,
    ProjectCardComponent,
    ItemFeedbackComponent,
    ModalProjectComponent,
    LinkDirective,
    AppDatePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    RouterModule.forRoot(ROUTES),
    TranslocoModule,
    TranslocoMessageFormatModule.forRoot(),
  ],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        availableLangs: ['en', 'ru'],
        prodMode: false,
        defaultLang: 'en',
        reRenderOnLangChange: true,
        missingHandler: {
          logMissingKey: false,
        },
      },
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
