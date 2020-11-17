import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PruebaService } from '../../services/prueba.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HusComponent } from '../dialogs/hus/hus.component';
import { NewEvaluationComponent } from '../dialogs/new-evaluation/new-evaluation.component';
import { ViewEvaluationComponent } from '../dialogs/view-evaluation/view-evaluation.component';




import Swal from 'sweetalert2'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as moment from 'moment';



@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css'],
  providers: [PruebaService]

})
export class ViewProjectComponent implements OnInit {

  public creator: any;
  public id: any
  public usuario: any
  public my : boolean;
  inviteForm: FormGroup;
  public project : any;
  public unido : boolean;
  public evaluations : any;

  constructor(private _route: ActivatedRoute, private _router: Router, private auth2: PruebaService, private fb: FormBuilder, public dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    moment.locale('es')

    this.creator = this._route.snapshot.paramMap.get('creator');
    this.id = this._route.snapshot.paramMap.get('project');


    //asignar validaciones al formulario
    this.inviteForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],

    });
    const user = await this.auth2.getCurrentUser();

    if (user) {
      this.usuario = user;
      if(this.usuario.uid == this.creator){
        this.my = true;
      }
      this.auth2.getProject(this.creator, this.id).then((data) => {
        //console.log(data.data());
        this.project = data.data();

        this.auth2.validateJoin(this.creator, this.id, this.usuario.uid).subscribe(resp =>{
          if (resp.length == 0) {
            this.unido = false;
          } else {
            this.unido = true;
          }

        })

        this.auth2.getEvaluations(this.creator, this.id).subscribe (evs =>{
          this.evaluations = evs;
          this.evaluations.forEach(element => {
            element.fecha = moment(element.fecha).fromNow()
      });
        })
      })
    } else {
      this._router.navigate(['/auth/login']);
    }

  }

  submit() {


    this.auth2.getInviteUser(this.inviteForm.value.email).subscribe(resp => {
      Swal.fire({
        title: 'Buscando usuario...',
        allowOutsideClick: false,
        timer: 1000,
        onBeforeOpen: () => {
          Swal.showLoading()
        },
        onClose: () => {
  
        }
      });
      if (resp.length == 0) {

        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'No hay usuario registrado con este email',
          showConfirmButton: false,
          timer: 1500
        })

      } else {
        const data ={ 
          link : `/view-project/${this.creator}/${this.id}`,
          fecha : Date.now(),
          nombre: this.usuario.displayName,
          mensaje : 'Hola, te invito a unirte a este proyecto...',
          foto : this.usuario.photoURL,
          proyecto: this.project.nombre
        }
         this.auth2.sendInvatition(resp[0].uid, data);
      }
    });
  }

  unirme(){

    Swal.fire({
      title: 'Por favor espera...',
      allowOutsideClick: false,
      timer: 1000,
      onBeforeOpen: () => {
        Swal.showLoading()
      },
      onClose: () => {

      }
    });

    const data = {
      creator : this.creator,
      user : this.usuario.uid,
      project : this.id,
      projectData : this.project,
      person : {
        displayName : this.usuario.displayName,
        email : this.usuario.email,
        uid : this.usuario.uid
      }
    }

    this.auth2.joinToProject(data);
  }


  addHU(ca : string, subca : string){

    const data ={
      caracteristica: ca,
      subcaracteristica : subca,
      creator: this.creator,
      project : this.id
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '380px';
    dialogConfig.height = '600px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
   const ref = this.dialog.open(HusComponent, dialogConfig);
    ref.afterClosed().subscribe(async res => {
      //console.log(res.data);

  })
  }

  newEvaluation(){

    const data ={
      id : this.id,
      creator : this.creator,
      user : this.usuario
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100%';
    dialogConfig.height = '85%';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
   const ref = this.dialog.open(NewEvaluationComponent, dialogConfig);
    ref.afterClosed().subscribe(async res => {
      console.log(res);

  })
  }

  viewEvaluation(evaluation){
    console.log(evaluation);
    
    this._router.navigate([`view-project/details-evalatuation/${this.creator}/${this.id}/${evaluation}`]);
    /*
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100%';
    dialogConfig.height = '90%';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = evaluation;
   const ref = this.dialog.open(ViewEvaluationComponent, dialogConfig);
    ref.afterClosed().subscribe(async res => {
      //console.log(res);

  })
  */
  }
}
