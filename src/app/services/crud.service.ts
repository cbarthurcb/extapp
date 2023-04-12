import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from "@angular/router";

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
  fc: number;
  flag: string;
  pas: number;
  fr:number;
  tc:number; 
  sncs:string;
}

@Injectable({
  providedIn: 'root'
})

export class CrudService {

  constructor(
    private ngFirestore: AngularFirestore,
    private router: Router
  ) { }

  createPatient(paciente: Paciente) {
    return this.ngFirestore.collection('Pacientes').add(paciente);
  }

  createScore(score: Score, id:string){
    return this.ngFirestore.collection('Pacientes').doc(id).collection('Scores').add(score);
  }

  getPacientes() {
    return this.ngFirestore.collection('Pacientes', ref => ref.orderBy('nome', 'asc')).snapshotChanges();
  }
  
  getScores(id:string){
    return this.ngFirestore.collection('Pacientes').doc(id).collection('Scores', ref => ref.orderBy('date', 'desc')).snapshotChanges();
  } 

  getLastScore(id:string) {
    return this.ngFirestore.collection('Pacientes').doc(id).collection<Score>('Scores', ref => ref.orderBy('date', 'desc').limit(2)).snapshotChanges();
  }

  delete(id: string) {
    this.ngFirestore.doc('Pacientes/' + id).delete();
  }

}