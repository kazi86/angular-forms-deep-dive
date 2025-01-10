import {afterNextRender, Component, DestroyRef, inject, viewChild} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {debounceTime, Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  imports:[FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  public form = viewChild.required<NgForm>('form');

  public destroyRef = inject(DestroyRef);

  constructor(){

    afterNextRender(()=>{

      const savedForm = JSON.parse(window.localStorage.getItem('login-signUp-data'));

      if(savedForm){

       setTimeout(()=>{
         this.form().setValue({
           email: savedForm.email,
           password: savedForm.password
         });
       },1)

      }

      const subscription= this.form().valueChanges?.pipe(debounceTime(500)).subscribe({
        next:(data)=>{

          window.localStorage.setItem('login-signUp-data',JSON.stringify({email:data.email,password:data.password}));

        }
      });

      this.destroyRef.onDestroy(()=>{

        subscription.unsubscribe();

      });

    })

  }

  public onSubmit(formData: NgForm){

    if(formData.form.invalid){
      return ;
    }

    const emailEntered = formData.form.value.email;
    const passwordEntered = formData.form.value.password;

    console.log(`${emailEntered} - ${passwordEntered}`);
    console.log(formData);

    this.form().form.reset();
  }

}
