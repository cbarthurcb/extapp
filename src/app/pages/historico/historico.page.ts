import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular'; 
import { NavController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { CrudService } from './../../services/crud.service';
import { ActionSheetController } from '@ionic/angular';
import { RouterLinkDelegate } from '@ionic/angular';
import { __values } from 'tslib';
import { LoadingController } from '@ionic/angular';

export class Paciente {
  $key: string;
  name: string;
  rh: string;
  age: number;
  gender: string;
  situation: string;
}

export class Score {
  $key: string;
  mews:number;
  flag: string;
  date: Date;
  fc: number;
  pas: number;
  fr:number;
  tc:number; 
  sncs:string;
}

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})



export class HistoricoPage implements OnInit {

  Paciente: any;
  Scores: any[];
  scores: any[];
  instructions: any[];
  icons: any[];
  colors: any[];
  mews = {};
  filtro = 'Ordenar por Score';
  Paciente_byscore: any;
  operator: boolean = true;
  queryText: string;
  allPatients: any;
  allInst: any;

  constructor(public loadingController: LoadingController, public alertController: AlertController, public actionSheetController: ActionSheetController, private router: Router, public NavCtrl: NavController, public toastController: ToastController, private crudService: CrudService) { 
    this.queryText = '';
    this.Scores = [];
  }

  ionViewWillEnter(){
    this.presentLoading();
    this.crudService.getPacientes().subscribe((res) => {
      this.Paciente = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as Paciente
        };
      })
      this.allPatients = this.Paciente;
      this.dataAnalysis(this.Paciente);
    }); 
  }

  ngOnInit() {
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'presentloader',
      message: 'Por favor aguarde...',
      duration: 2000
    });
    await loading.present();
  }

  public dataAnalysis(Paciente: any){
    this.icons = []
    this.colors = []

    for (let paciente of Paciente) {
      let color = '';
      let icon = '';
      
      this.crudService.getLastScore(paciente.id).subscribe((res)=>{
        let lastscore = -1
        let flag = 'normal'
        let diff = 0
        let last = res.map((t) => {
          return {
            id: t.payload.doc.id,
            ...t.payload.doc.data() as Score
          };
        });
        if(last.length == 0){
          color = 'none'
          icon = 'none'
          lastscore = -1
          flag = 'normal'
        }
        else if(last.length == 1){
          color = this.scoreVerification(last[0].mews)
          icon = 'stop-circle'
          lastscore = last[0].mews
        }
        else{
          lastscore = last[0].mews
          diff = lastscore - last[1].mews
          flag = last[0].flag
          color = this.scoreVerification(last[0].mews)
          if(flag == 'alert'){
            icon = 'alert-circle';
            color = '#af3f3f';//vermelho
          }
          else if(diff >=2){
            flag = 'ascending'
            icon = 'caret-up-circle';
            color = '#af3f3f'; //vermelho
          }
          else if(diff < 0){
            icon = 'caret-down-circle';
          }
          else{
            icon = 'stop-circle';
          }
        }
        paciente.color = color
        paciente.icon = icon
        paciente.score = lastscore
        paciente.flag = flag
      });
    }
    console.log(Paciente)
  }
  
  scoreVerification(score: number){
    let color = ''
    if(score <=2){
      color = '#00b272';//verde
    }
    else if(score <=4){
      color = '#e0d32f';//amarelo
    }
    else if(score > 4){
      color = '#af3f3f'; //vermelho
    }
    return color
  }

  filterPatients(paciente:any){
    let val = paciente.target.value;
    if(val && val.trim() != ''){
      this.Paciente = _.values(this.allPatients);
      this.Paciente = this.Paciente.filter((pat) => {
        return (pat.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })    
    } 
    else{
      this.Paciente = this.allPatients;
    }
  }

  Switch(){
    if(this.operator == true){
        this.operator = false;
        this.Paciente_byscore = this.Paciente.sort((a, b) => (a.score > b.score) ? 1 : -1)
        this.Paciente = this.Paciente_byscore;
        this.filtro = 'Ordenar de A-Z'
    }
    else{
      this.operator = true;
      this.Paciente = this.Paciente.sort((a, b) => (a.nome > b.nome) ? 1 : -1)
      this.filtro = 'Ordenar por Score'
    }
  }

  async presentToast(messagecontent) {
    const toast = await this.toastController.create({
      message: messagecontent,
      duration: 2000
    });
    toast.present();
  }

  Nav(id:string, name:string){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        user:id,
        nome:name,
      }
    };
    this.NavCtrl.navigateForward('score', navigationExtras).catch(e => {this.presentToast(e.message)});
  }
  
  async ExclusionAlert(name: string, id:string) {
    const alert = await this.alertController.create({
      cssClass: 'hist-al',
      header: `Confirmar a exclusão?`,
      message: `Isso irá excluir <strong>todos</strong> os dados de ${name} do banco de dados!!`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.presentLoading()
            this.crudService.delete(id);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async Direct(id:string, score: number, name:string, flag: string) {
    let text = 'Alerta!'
    let mensagem = ''
    if(score > 4){
      mensagem = 'Este paciente está com um MEWS Score considerado grave, ou seja, acima de 4 pontos. Clique em "Ver" para analisar as informações.'
    }
    else{
      text = 'Normal'
      mensagem = `A última pontuação registrada deste paciente foi ${score}. Clique em "Ver" para analisar as informações.`
    }
    if(flag.includes('alert')){
      mensagem = 'Este paciente está com um dos componentes da aferição em estado grave. Clique em "Ver" para analisar as informações.'
    }
    else if(flag.includes('ascending')){
      mensagem = 'A última aferição registrada deste paciente aumentou em no mínimo 2 pontos em relação a última. Clique em "Ver" para analisar as informações.'
    }

    const alert = await this.alertController.create({
      cssClass: 'direct-al',
      header: `Análise de Dados: ` + text,
      message: mensagem,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ver',
          handler: () => {

            this.Nav(id, name)
          }
        }
      ]
    });

    await alert.present();
  }

  async presentActionSheet(name: string, id:string, mews: any, situation:string) {
    if(mews == -1) mews = "N/A";
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'hist-act-sht',
      header: `Paciente ${name}, MEWS: ${mews} `,
      buttons: [
        { 
          text: 'Análise de dados',  
          handler: () =>{
            this.Direct(id , mews, name, situation)
          }
        },
        { 
          text: 'Ver página do paciente', 
          handler: ()=>{

            this.Nav(id, name);
          } 
        },
        {
          text: 'Excluir paciente',
          role: 'destructive',
          handler: ()=>{
            this.ExclusionAlert(name, id);
          }
        }
      ]
    });

    await actionSheet.present();
  }
}


