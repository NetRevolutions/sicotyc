import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {Subscription, delay, forkJoin} from 'rxjs';

// Models
import {User} from '@/models/user.model';
import {Role} from '@/models/role.models';

// Services
import {UserService} from '@services/user.service';
import {SearchesService} from '@services/searches.service';
import {RoleService} from '@services/role.service';
import {ModalImageService} from '@services/modal-image.service';

// Enums
import {enumModel} from '@/utils/models.enum';

// Interfaces
import {IUserProfileUpdate} from '@/interfaces/user-profile-update.interface';
import {enumTypeImage} from '@/utils/type-image.enum';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
    public totalUsers: number = 0;
    public users: User[] = [];
    public usersTemp: User[] = [];
    public from: number = 0;
    public loading: boolean = true;
    public roles: Role[];
    public imgSubs: Subscription;

    dropdownSettings = {};
    selectedItems = [];

    constructor(
        private userService: UserService,
        private searchesService: SearchesService,
        private roleService: RoleService,
        private toastr: ToastrService,
        private modalImagenService: ModalImageService
    ) {}

    ngOnDestroy(): void {
        this.imgSubs.unsubscribe();
    }

    ngOnInit(): void {
        // More information ==> http://cuppalabs.github.io/components/multiselectDropdown/
        this.dropdownSettings = {
            singleSelection: false,
            text: 'Seleccione Roles',
            enableCheckAll: false,
            enableFilterSelectAll: false,
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            enableSearchFilter: false,
            classes: 'myclass custom-class',
            labelKey: 'roleName',
            primaryKey: '_id',
            autoPosition: true
        };

        this.loadData();

        this.imgSubs = this.modalImagenService.newImage
            .pipe(delay(100))
            .subscribe((img) => this.loadData());
    }

    loadData() {
        let roles = this.roleService.getRoles();
        let userList = this.userService.getUsers(this.from);

        forkJoin([roles, userList]).subscribe({
            next: (results) => {
                let result0: any = results[0];
                if (result0.ok) {
                    this.roles = result0.roles;
                    //console.log('roles', this.roles);
                }

                if (results[1].ok) {
                    this.totalUsers = results[1].total;
                    this.users = results[1].users;
                    this.usersTemp = results[1].users;

                    this.loading = false;
                }
            },
            error: (err) => {
                this.loading = false;
                this.toastr.error(
                    'Se produjo un error, contacte al administrador'
                );
                console.error(err.error.msg);
            }
        });
    }

    changePage(val: number) {
        this.from += val;

        if (this.from < 0) {
            this.from = 0;
        } else if (this.from > this.totalUsers) {
            this.from -= val;
        }

        this.loadData();
    }

    search(term: string) {
        if (term.length === 0) {
            return (this.users = this.usersTemp);
        }

        this.searchesService.search(enumModel.USER, term).subscribe({
            next: (results) => {
                this.users = results;
            },
            error: (err) => {
                this.toastr.error('Se produjo un error al buscar datos');
                console.error(err);
            }
        });
    }

    deleteUser(user: User) {
        if (user.uid === this.userService.uid) {
            return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
        }

        Swal.fire({
            title: 'Borrar Usuario?',
            text: `Esta a punto de borrar a ${user.fullName}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Si, borrarlo'
        }).then((result) => {
            if (result.value) {
                this.userService.deleteUser(user).subscribe({
                    next: () => {
                        this.loadData();
                        Swal.fire(
                            'Usuario Eliminado',
                            `El usuario ${user.fullName} ha sido eliminado correctamente`,
                            'success'
                        );
                    },
                    error: (err) => {
                        this.toastr.error(
                            `Se produjo un error al eliminar al usuario ${user.fullName}`
                        );
                        console.error(err);
                    }
                });
            }
        });
    }

    asignRole(user: User) {
        console.log('user', user);
        // Validar que si quitamos un rol a un usuario que tenia antes este rol le mostremos un mensaje de alerta.
        // Usar usersTemp para comparar.

        this.userService.saveUser(user).subscribe((resp) => {
            //console.log(resp);
        });
    }

    onRoleSelectAll(items: any) {
        console.log(items);
    }

    onRoleDeSelectAll(items: any) {
        // console.log(items);
        this.toastr.warning('Debe de seleccionar al menos un rol');
    }

    openModal(user: User) {
        this.modalImagenService.openModal(
            enumTypeImage.USERS,
            user.uid,
            user.imagePath
        );
    }
}
