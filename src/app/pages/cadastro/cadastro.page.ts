import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { CrudService } from './../../services/crud.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular'; 
import { pathToFileURL } from 'url';
import { identifierModuleUrl } from '@angular/compiler';
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
  date: Date;
  flag: string;
  fc: number;
  pas: number;
  fr:number;
  tc:number; 
  sncs:string;
}

@Component({  
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})

export class CadastroPage implements OnInit {
  SNCS: Array<{value:string}>;
  selectedView = 'Pacientes';
  last: Date;
  flag: string

  pacienteForm: FormGroup;
  mewsForm: FormGroup;
  allpatients: Paciente[]
  
  constructor(public loadingController: LoadingController, public toastController: ToastController, private crudService: CrudService, public formBuilder: FormBuilder, private router: Router) {

    this.last = new Date();
    this.flag = 'OK'
    this.SNCS = [
      {value: "Agitado/Confuso"},
      {value: "Alerta"},
      {value: "Responde à Voz"},
      {value: "Responde à Dor"},
      {value: "Sem Resposta"}
    ]
  }

  ionViewWillEnter(){
    this.crudService.getPacientes().subscribe((res) => {
      this.allpatients = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as Paciente
        };
      });
    });
  }

  ngOnInit() {
    this.pacienteForm = this.formBuilder.group({
      nome: [''],
      rh: [],
      age: [],
      gender: [''],
      situation: ['normal']
    });
    this.mewsForm = this.formBuilder.group({
      paciente: [''],
      fc: [],
      pas: [],
      tc: [],
      fr: [],
      sncs: [''],
    });
  }

  onSubmitPaciente() {
    if (!this.pacienteForm.valid) {
      this.presentToast('Preencha todas as informações do paciente!');
      return false;
    } else {
      this.presentLoading()
      this.crudService.createPatient(this.pacienteForm.value)
      .then(() => {
        this.pacienteForm.reset();
      }).catch((err) => {
        console.log(err)
      });
      this.presentToast('Paciente Cadastrado!')
    }
  }

  onSubmitMews() {
    if (!this.mewsForm.valid) {
      this.presentToast('Preencha todas as informações da medição!');
      return false;
    } else {
      let values = this.mewsForm.value;
      values.date = new Date().toLocaleString()
      values.mews = this.MEWS(values)
      values.flag = this.flag
      this.presentLoading();
      this.crudService.createScore(values, this.mewsForm.value.paciente)
      .then(() => {
        this.mewsForm.reset();
      }).catch((err) => {
        console.log(err)
      });
      this.presentToast('Medição Adicionada!')
    }
  }  

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'presentloader',
      message: 'Por favor aguarde...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }


  async presentToast(messagecontent) {
    const toast = await this.toastController.create({
      message: messagecontent,
      duration: 2000
    });
    toast.present();
  }

  MEWS(values: any){
    let mews = 0;
  
    //Frequência Cardíaca
    if (_.inRange(values.fc, 130, 10000)){
      mews+=3;
      this.flag = 'alert';
    } 
    else if(_.inRange(values.fc, 42) || _.inRange(values.fc, 111,130)) mews+=2;
    else if (_.inRange(values.fc, 41, 51) || _.inRange(values.fc, 101,111)) mews+=1;

    //Pressão Arterial Sistólica
    if(_.inRange(values.pas, 72) || _.inRange(values.pas, 200, 10000)){
      mews+=3;
      this.flag = 'alert';
    }
    else if (_.inRange(values.pas, 71, 81) || _.inRange(values.pas, 180,200)) mews+=2;
    else if (_.inRange(values.pas, 81, 101)) mews+=1;

    //Frequência Respiratória
    if(_.inRange(values.fr, 30, 10000)){
      mews+=3;
      this.flag = 'alert';
    } 
    else if (_.inRange(values.fr, 10) || _.inRange(values.fr, 26, 30)) mews+=2;
    else if (_.inRange(values.fr, 19, 26)) mews+=1;

    //Temperatura Corporal
    if(_.inRange(values.tc, 35) || _.inRange(values.tc, 39, 10000)) mews+=2;
    else if (_.inRange(values.tc, 35, 36) || _.inRange(values.tc, 38,39)) mews+=1;  

    //Sistema Nervoso Central
    switch(values.sncs){
      case 'Responde à Dor': 
        mews += 2;
        break;
      case 'Responde à Voz':
      case 'Agitado/Confuso':
        mews += 1;
        break;
      case 'Sem Resposta':
        this.flag = 'alert';
        mews += 3; 
        break;
      default:
        mews += 0;
        break;
    }

    return mews;
  }
}