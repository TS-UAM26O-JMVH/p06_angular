import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RegistroService } from '../../services/registro';
import { ProgresoService } from '../../services/progreso';
import { Api } from '../../services/servAPI/api'; //SE importa y se inyecta el servicio de la API

@Component({
  selector: 'app-registro',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit {
  pasos: any[] = [];
  pasosComp: { [clave: number]: boolean } = {};
  pasoActual = 0;
  registrando = false;
  errorRegistro: string | null = null;

  constructor(
    private translate: TranslateService,
    private registroService: RegistroService,
    private progresoService: ProgresoService,
    private apiService: Api
  ) { }

  ngOnInit() {
    this.pasos = this.registroService.obtenerPasos();
    this.progresoService.pasoActual$.subscribe((paso) => (this.pasoActual = paso));
    this.progresoService.pasosCompletados$.subscribe((completados) => (this.pasosComp = completados));
  }

  cambiarIdioma(lang: string) {
    this.translate.use(lang);
  }

  registrar() {
    const todosCompletos = this.pasosComp[0] && this.pasosComp[1] && this.pasosComp[2];

    if (!todosCompletos) {
      this.errorRegistro = 'Es necesario completar todos los formularios antes de registrar';
      return;
    }

    this.registrando = true;
    this.errorRegistro = null;

    const datosPersonal = JSON.parse(localStorage.getItem('datosFormularioPersonal') || '{}');
    const datosCuenta = JSON.parse(localStorage.getItem('datosFormularioCuenta') || '{}');
    const datosDireccion = JSON.parse(localStorage.getItem('datosFormularioDireccion') || '{}');

    const datosParaEnviar = {
      first_name: datosPersonal.nombre,
      last_name: `${datosPersonal.primerApellido || ''} ${datosPersonal.segundoApellido || ''}`.trim(),
      date_of_birth: datosPersonal.fechaNacimiento,
      gender: datosPersonal.genero,
      nationality: datosPersonal.nacionalidad,
      contact_phone_number: datosCuenta.telefono,
      email: datosCuenta.email,
      username: datosCuenta.nombreUsuario,
      password: datosCuenta.contrasena,
      occupation: datosCuenta.ocupacion,
      role: datosCuenta.rol,
      address_zip_code: datosDireccion.codigoPostal,
      address_state: datosDireccion.estado,
      address_city: datosDireccion.ciudad,
      address_neighborhood: datosDireccion.colonia,
      address: datosDireccion.calle,
      address_number: datosDireccion.numeroExterior,
      address_interior_number: datosDireccion.numeroInterior,
      address_complement: datosDireccion.referencia,
      is_active: true,
      is_superuser: false,
    };

    this.apiService.registrarUsuario(datosParaEnviar).subscribe({
      next: () => {
        alert('Registro exitoso');
        this.limpiarFormularios();
        this.registrando = false;
      },
      error: (error) => {
        this.errorRegistro = this.obtenerMensajeError(error);
        this.registrando = false;
      },
    });
  }

  private obtenerMensajeError(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    switch (error.status) {
      case 400:
        return 'Datos inválidos enviados al servidor';
      case 401:
        return 'No autorizado';
      case 500:
        return 'Error interno del servidor. Intente más tarde';
      default:
        return 'Ocurrió un error al registrar. Intente nuevamente';
    }
  }

  private limpiarFormularios(): void {
    localStorage.removeItem('datosFormularioPersonal');
    localStorage.removeItem('datosFormularioCuenta');
    localStorage.removeItem('datosFormularioDireccion');
  }
}
