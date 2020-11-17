import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { PruebaService } from '../../../services/prueba.service';
import { CategoryEvaluationComponent } from '../category-evaluation/category-evaluation.component';

@Component({
  selector: 'app-new-evaluation',
  templateUrl: './new-evaluation.component.html',
  styleUrls: ['./new-evaluation.component.css'],
  providers: [PruebaService]

})
export class NewEvaluationComponent implements OnInit {

  public hus: any;
  public caracteristicas: any = [];
  public project: any;
  public status : any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewEvaluationComponent>, private auth2: PruebaService, private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.caracteristicas = [];

    this.auth2.getProject(this.data.creator, this.data.id).then((data) => {
      this.project = data.data();
      this.caracteristicas = this.project.caracteristicas;
    })

  }

  onClose() {
    this.dialogRef.close();
  }

  async submit() {

    this.project.total  = 0;
    this.caracteristicas.forEach(element => {
      this.project.total += element.sumacat;
    });

    

    if (this.project.total == 0) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Empieza a evaluar !!',
        showConfirmButton: false,
        timer: 1500
      })
      return;
    }

    if (this.project.total  <= 49){
      this.status = 'Deficiente'
    } else if (this.project.total >= 50 && this.project.total <= 74){
      this.status = 'Regular'
    } else if (this.project.total >= 75 && this.project.total <= 89){
      this.status = 'Acceptable'
    } else if (this.project.total >= 90 && this.project.total <= 94){
      this.status = 'Bueno'
    } else if (this.project.total >= 95 && this.project.total <= 100){
      this.status = 'Muy bueno'
    }

    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Deja un comentario sobre el proyecto*',
      inputPlaceholder: 'Escribe tu comentario aqui...',
      inputAttributes: {
        'aria-label': 'Escribe tu comentario aqui'
      },
      showCancelButton: true
    })

    if (text) {

      const fulldata = {
        creator: this.data.creator,
        project: this.data.id,
        evaluation: {
          usuario : this.data.user.email,
          fecha : Date.now(),
          status : this.status,
          total: Math.round(this.project.total * 100) / 100,
          porcentaje: Math.round(this.project.total * 100) / 100,
          comentario: text,
          caracteristicas: this.caracteristicas
        }
      }
      this.auth2.addEvaluation(fulldata).then(()=>{
        this.dialog.closeAll();
      });

    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'El comentario es obligatorio !',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  evalueCategoria(cac: any, i: any) {

    const data = {
      categoria: cac,
      creador: this.data.creator,
      id: this.data.id,
      index: i
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '800px';
    dialogConfig.disableClose = true;
    dialogConfig.height = '400px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const ref = this.dialog.open(CategoryEvaluationComponent, dialogConfig);

    ref.afterClosed().subscribe(async res => {

      this.caracteristicas[res.index] = res.categoria;
      
    })
  }


}
