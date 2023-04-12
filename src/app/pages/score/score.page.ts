import { Component, OnInit } from '@angular/core';
import { CrudService } from './../../services/crud.service';
import { ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular'; 
import * as _ from 'lodash';
import { ChartDataSets, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { LoadingController } from '@ionic/angular';

export class Score {
  $key: string;
  mews:number;
  date: Date;
  fc: number;
  flag: string;
  pas: number;
  fr:number;
  tc:number; 
  sncs:string;
}

@Component({
  selector: 'app-score',
  templateUrl: './score.page.html',
  styleUrls: ['./score.page.scss'],
})

export class ScorePage implements OnInit{
  scores = [];
  name: string;
  id: string;
  public chartData: ChartDataSets[] = [{data: [], label: 'Últimas Medições'}];
  public chartType: ChartType = "line";
  public chartLabels: Label[] = [];
  
  selectedView = 'Score';

  constructor(public loadingController: LoadingController, private crudService: CrudService, private route: ActivatedRoute, public toastController: ToastController) {
    this.name = "Placeholder";
    this.scores = [{
      score: 0,
      horario: '20/09/2021 às 12:30',
      fc: 90,
      fr: 10,
      tc: 35,
      pas: 120,
      sncs: 'Alerta'
    }]
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'presentloader',
      message: 'Por favor aguarde...',
      duration: 2000
    });
    await loading.present();
  }

  ionViewDidEnter(){

    this.scores = []
    this.presentLoading();
    this.route.queryParams.subscribe(params => {
      this.id = params["user"];
      this.name = params["nome"];
    });
      this.crudService.getScores(this.id).subscribe((res) => {
      this.scores = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as Score
        };
      });
      console.log(this.scores)
      this.newMethod(this.scores)
    });
  }

  ngOnInit() {
  }



  newMethod(scores) {
    this.chartData = [{data: [], label: 'Últimas Medições'}]
    this.chartLabels = []
    for (let i = 0; i < scores.length; i++) {
      let str = scores[i].date
      let label = str.split(" ");
      (this.chartData[0].data as number[]).push(scores[i].mews);
      this.chartLabels.push(label[0]);
    }
    this.chartData[0].data.reverse()
    this.chartLabels.reverse()
  }

  async presentToast(messagecontent) {
    const toast = await this.toastController.create({
      message: messagecontent,
      duration: 2000
    });
    toast.present();
  }

}
