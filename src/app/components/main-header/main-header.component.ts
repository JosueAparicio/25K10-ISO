import { Component, Input, OnInit } from '@angular/core';
import { PruebaService } from '../../services/prueba.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { NewProjectComponent } from '../dialogs/new-project/new-project.component';

import Swal from 'sweetalert2'
import { Router } from '@angular/router';



@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css'],
  providers: [PruebaService]

})
export class MainHeaderComponent implements OnInit {


  @Input() usuario: any;
  @Input() view: string;
  @Input() ev: string;
  @Input() url: string;

  constructor(private _router: Router, private auth2 : PruebaService,  private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {


  }


  openDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '500px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = this.usuario;
   const ref = this.dialog.open(NewProjectComponent, dialogConfig);
    ref.afterClosed().subscribe(async res => {
      //console.log(res.data);
      this.auth2.createProject(res.data);
  })
  }

    //SMALL ALERTS
    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 5000,
      });
    }

    back(){
      this._router.navigate([`${this.url}`])
    }
}
