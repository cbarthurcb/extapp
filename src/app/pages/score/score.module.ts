import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScorePageRoutingModule } from './score-routing.module';
import { ChartsModule } from 'ng2-charts';
import { ScorePage } from './score.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScorePageRoutingModule,
    ChartsModule
  ],
  declarations: [ScorePage]
})
export class ScorePageModule {}
