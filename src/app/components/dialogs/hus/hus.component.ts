import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PruebaService } from '../../../services/prueba.service';

@Component({
  selector: 'app-hus',
  templateUrl: './hus.component.html',
  styleUrls: ['./hus.component.css'],
  providers: [PruebaService]

})
export class HusComponent implements OnInit {

  public hus: any;
  huForm: FormGroup;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<HusComponent>, private auth2 : PruebaService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.auth2.getHUS(this.data).subscribe(hus=>{
      this.hus = hus;
    })

    this.huForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],

    });
  }

  addHU(){
    
    if(this.huForm.invalid || this.huForm.value.nombre == ''){
      return;
    } else{
      console.log('agregando');

      const data = {
        nombre : this.huForm.value.nombre,
        caracteristica : this.data.caracteristica,
        subcaracteristica : this.data.subcaracteristica,
        creator : this.data.creator,
        project : this.data.project,
        fecha : Date.now()
      }

      this.auth2.addHU(data);
      this.huForm.reset();

    }
  }

  deleteHU(id:string){
    const data = {
      creator : this.data.creator,
      project : this.data.project,
      id : id
    }

    this.auth2.deleteUH(data);
  }

}
