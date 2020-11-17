import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PruebaService } from '../../../services/prueba.service';
import * as moment from 'moment';

@Component({
  selector: 'app-bandeja-content',
  templateUrl: './bandeja-content.component.html',
  styleUrls: ['./bandeja-content.component.css'],
  providers: [PruebaService]

})
export class BandejaContentComponent implements OnInit {

  @Input() usuario: any;
  public inboxs : any;
  constructor(private _router: Router, private auth2: PruebaService) { }

  ngOnInit(): void {
    moment.locale('es')

      this.auth2.getInbox(this.usuario.uid).subscribe(data => {
        this.inboxs = data;
        this.inboxs.forEach(element => {
              element.fecha = moment(element.fecha).fromNow()
        });
      })


  }

}
