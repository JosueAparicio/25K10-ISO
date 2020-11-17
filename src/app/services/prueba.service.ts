import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2'




@Injectable()
export class PruebaService {

    public usuario: any = {};
    constructor(private afAuth: AngularFireAuth, private _router: Router, private db: AngularFirestore) {


    }

    async login(provider: string) {
        if (provider == 'google') {
            return await this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(data => {
                // console.log(data.user);
                this.getUserData(data.user.uid).subscribe(user =>{
                    if(user){
                        this._router.navigate(['/home/dashboard']);

                    } else{
                        this.createNewUser(data.user);
                        this._router.navigate(['/home/dashboard']);

                    }
                });
            });
        }

        else if (provider == 'github') {
            return await this.afAuth.auth.signInWithPopup(new firebase.auth.GithubAuthProvider()).then(data => {
                //console.log(data.user);
                this.getUserData(data.user.uid).subscribe(user =>{
                    if(user){
                        this._router.navigate(['/home/dashboard']);

                    } else{
                        this.createNewUser(data.user);
                        this._router.navigate(['/home/dashboard']);

                    }
                });                
            });
        }



    }

    async getCurrentUser() { // Recoge al usuario actual si es que existe
        return this.afAuth.authState.pipe(first()).toPromise();

    }

    logout() {

        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "Se cerrará tu sesión!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
        }).then(async (result) => {
            if (result.value) {

                Swal.fire({
                    title: 'Cerrando Sesion...',
                    allowOutsideClick: false,
                    timer: 1000,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    },
                    onClose: () => {
                        this.afAuth.auth.signOut().then(() => {
                            this._router.navigate(['/auth/login']);
                        });
                    }
                });
            }
        })

    }

    async createNewUser(data): Promise<void> {//Crea un un nuevo usuario en el documento 'users' de firestore
        //console.log(data);
        const newData = {
            displayName: data.displayName,
            uid: data.uid,
            photoURL: data.photoURL,
            email: data.email
        }
        return this.db.collection('users').doc(data.uid).set(newData);
    }

    getUserData(uid: string) {
        return this.db.collection('users').doc(uid).valueChanges();
    }


    //PROJECTS

    getProject(creator: string, id: string) {

        return this.db.doc(`users/${creator}/projects/${id}`).ref.get();

    }

    getMyProjcts(uid: string) {
        return this.db.collection(`users/${uid}/projects/`, ref => ref.orderBy('fecha', 'desc').limit(50)).snapshotChanges().pipe(map(actions => {

            return actions.map(a => {
                const data = a.payload.doc.data() as any;
                data.id = a.payload.doc.id
                //console.log(data);
                return data;
            })
        }));
    }

    createProject(data) {

        return this.db.collection(`users/${data.creador}/projects`).add(data).then(resp =>
            this.db.collection(`projects/${data.creador}/projects`).add(data).then(() => {


                setTimeout(() => {
                    this._router.navigate(['/home/dashboard'])

                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Proyecto creado exitosamente',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }, 500);

            })

        ).catch(err => {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Algo salio mal',
                showConfirmButton: false,
                timer: 1500
            });
            console.log(err);
        });

    }


    getInviteUser(email: string) {
        return this.db.collection(`users/`, ref => ref.where('email', '==', email)).snapshotChanges().pipe(map(actions => {

            return actions.map(a => {
                const data = a.payload.doc.data() as any;
                return data;
            })
        }));

    }

    sendInvatition(uid: string, data: any) {

        return this.db.collection(`users/${uid}/inbox`).add(data).then(() => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Se invito al usuario',
                showConfirmButton: false,
                timer: 1500
            })
        });

    }

    getInbox(uid: string) {

        return this.db.collection(`users/${uid}/inbox/`, ref => ref.orderBy('fecha', 'desc').limit(10)).snapshotChanges().pipe(map(actions => {

            return actions.map(a => {
                const data = a.payload.doc.data() as any;
                data.id = a.payload.doc.id
                //console.log(data);
                return data;
            })
        }));

    }


    joinToProject(data){

        this.db.doc(`users/${data.creator}/projects/${data.project}/persons/${data.user}`).set(data.person).then((resp) => console.log('Exito')).catch(error => console.log(error));
        this.db.doc(`users/${data.user}/projects/${data.project}/`).set(data.projectData).then((resp) => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Unido exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        }).catch(error => console.log(error));

    }

    validateJoin(creator: string,  project: string, user: string){

       return this.db.collection(`users/${creator}/projects/${project}/persons/`, ref => ref.where('uid', '==', user)).snapshotChanges().pipe(map(actions => {

        return actions.map(a => {
            const data = a.payload.doc.data() as any;
            return data;
        })
    }));
    }

    getHUS(data){
        return this.db.collection(`users/${data.creator}/projects/${data.project}/hus/`, ref => ref.where('subcaracteristica', '==', data.subcaracteristica)).snapshotChanges().pipe(map(actions => {

            return actions.map(a => {
                const data = a.payload.doc.data() as any;
                data.id = a.payload.doc.id
                return data;
            })
        }));
    }

    getHUSCaracteistica(creador , project, caracteristica){
        return this.db.collection(`users/${creador}/projects/${project}/hus/`, ref => ref.where('caracteristica', '==', caracteristica)).snapshotChanges().pipe(map(actions => {

            return actions.map(a => {
                const data = a.payload.doc.data() as any;
                data.id = a.payload.doc.id
                return data;
            })
        }));
    }

    addHU(data){
        return this.db.collection(`users/${data.creator}/projects/${data.project}/hus`).add(data).then(() => {console.log('exito')});
    }

    deleteUH(data){
        return this.db.collection(`users/${data.creator}/projects/${data.project}/hus`).doc(data.id).delete().then(() => {console.log('exito')});

    }


    addEvaluation(data){
        return this.db.collection(`users/${data.creator}/projects/${data.project}/evaluations`).add(data.evaluation).then(() => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Se publicó su evaluación!',
                showConfirmButton: false,
                timer: 1500
            })
        });

    }

    getEvaluations(creator, project){
        return this.db.collection(`users/${creator}/projects/${project}/evaluations/`, ref => ref.orderBy('fecha', 'desc').limit(20)).snapshotChanges().pipe(map(actions => {

            return actions.map(a => {
                const data = a.payload.doc.data() as any;
                data.id = a.payload.doc.id;
                return data;
            })
        }));
    }

    getEvaluation(creator, project, ev){

        return this.db.doc(`users/${creator}/projects/${project}/evaluations/${ev}`).valueChanges();
        
    }
}