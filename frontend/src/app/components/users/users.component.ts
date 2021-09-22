import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user';
import { RestUserService } from 'src/app/services/restUser/rest-user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  user: User;
  users: Array<User> = [];
  roles: Array<String> = ["ROLE_USER", "ROLE_ADMIN", "ROLE_BIBLIOTECARY"];
  order: string = "Ascendente";

  constructor(private restUser: RestUserService) {
    this.user = new User("", 0, "", "", "", "", "", 0, "", [], [], [], [], 0);
  }

  ngOnInit(): void {
    this.restUser.getUsers().subscribe((resp: any) => {
      if (resp.users) {
        this.users = resp.users;
        localStorage.setItem("users", JSON.stringify(resp.users));
      } else {
        alert(resp.message);
      }
    },
      (error: any) =>
        alert(error.error.message)
    )
  }

  ngDoCheck(): void {
    this.users = JSON.parse(localStorage.getItem("users")!);
  }

  onSubmit(userForm: NgForm) {
    this.restUser.register(this.user).subscribe((resp: any) => {
      if (resp.userSaved) {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado exitosamente'
        })
        userForm.reset();
        this.users.push(resp.userSaved);
        localStorage.setItem("users", JSON.stringify(this.users)!);
      } else {
        alert(resp.message);
      }
    },
      (error: any) =>
        alert(error.error.message)
    )
  }

  setUserInfo(user: any) {
    console.log(user);
    this.user = user;
  }

  deleteUserInfo() {
    this.user = new User("", 0, "", "", "", "", "", 0, "", [], [], [], [], 0);
  }

  updateUser(userForm: NgForm) {
    let user: any = this.user;
    delete user.password;
    this.restUser.updateUser(user).subscribe((resp: any) => {
      console.log(resp);
      if (resp.userUpdated) {
        userForm.reset();
        this.user = new User("", 0, "", "", "", "", "", 0, "", [], [], [], [], 0);
        alert("Usuario actualizado exitosamente");
        this.ngOnInit();
      } else {
        alert(resp.message);
      }
    },
      (error: any) =>
        alert(error.error.message)
    )
  }

  deleteUser(user: any) {
    this.setUserInfo(user);
    let userToDelete: any = this.user;
    Swal.fire({
      title: "¿Eliminar usuario " + userToDelete.username + " ?",
      text: "Esta acción no se puede remover",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
      .then(resultado => {
        if (resultado.value) {
          this.restUser.deleteUser(this.user._id).subscribe((resp: any) => {
            if (resp.userRemoved) {
              alert("Usuario eliminado exitosamente");
              this.users = resp.user;
              this.ngOnInit();
              this.user = new User("", 0, "", "", "", "", "", 0, "", [], [], [], [], 0);
            } else {
              alert(resp.message);
            }
          },
            (error: any) => {
              alert(error.error.message);
            })
        } else {
          this.deleteUserInfo();
        }
      });
  }

}
