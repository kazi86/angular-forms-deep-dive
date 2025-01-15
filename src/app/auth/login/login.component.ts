import {afterNextRender, Component, DestroyRef, inject, OnInit, viewChild} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {debounceTime, of, Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  imports:[FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})



export class LoginComponent implements OnInit {

  public form = new FormGroup({
    email: new FormControl('',{
      validators:[Validators.email,Validators.required],
      asyncValidators:[this.isEmailUnique]
    }),
    password : new FormControl('',{
      validators:[Validators.required,this.mustContainAQuestionMark]
    }),
  });


  // public form = viewChild.required<NgForm>('form');
  //
  public destroyRef = inject(DestroyRef);

  constructor(){

    // afterNextRender(()=>{
    //
    //   const savedForm = JSON.parse(window.localStorage.getItem('login-signUp-data'));
    //
    //   if(savedForm){
    //
    //    setTimeout(()=>{
    //      this.form().setValue({
    //        email: savedForm.email,
    //        password: savedForm.password
    //      });
    //    },1)
    //
    //   }
    //
    //   const subscription= this.form().valueChanges?.pipe(debounceTime(500)).subscribe({
    //     next:(data)=>{
    //
    //       window.localStorage.setItem('login-signUp-data',JSON.stringify({email:data.email,password:data.password}));
    //
    //     }
    //   });
    //
    //   this.destroyRef.onDestroy(()=>{
    //
    //     subscription.unsubscribe();
    //
    //   });
    //
    // })

  }

  public ngOnInit(){

    const savedValues = JSON.parse(window.localStorage.getItem('save-login-signUp'));

    const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({

      next:(value)=>{

        window.localStorage.setItem('save-login-signUp',JSON.stringify({email: value.email, password: value.password}));

      }

    });

    this.form.setValue({

      email: savedValues.email,
      password: savedValues.password

    });

    this.destroyRef.onDestroy(()=>{

        subscription.unsubscribe();

    });

  }

  // public onSubmit(formData: NgForm){
  //
  //   if(formData.form.invalid){
  //     return ;
  //   }
  //
  //   const emailEntered = formData.form.value.email;
  //   const passwordEntered = formData.form.value.password;
  //
  //   console.log(`${emailEntered} - ${passwordEntered}`);
  //   console.log(formData);
  //
  //   this.form().form.reset();
  // }

  public onSubmit(){

    const email = this.form.value.email;
    const password = this.form.value.password;

    console.log(this.form);
    console.log(`${email}- ${password}`)

  }

  public mustContainAQuestionMark(control: AbstractControl){

    if(control.value.includes('?')){
      return null;
    }

    return {doesNotContainAQuestionMark : true}

  }

  public isEmailUnique(control: AbstractControl){

    if(control.value !== 'test@exmaple.com'){
      return of(null);
    }

    return of({emailIsAlreadyInUse: true});

  }

  get getIsEmailInvalid(){

    return (
      this.form.controls.email.dirty &&
      this.form.controls.email.touched &&
      this.form.controls.email.invalid
    )

  }

  get getIsPasswordInvalid(){

    return (
      this.form.controls.password.dirty &&
      this.form.controls.password.touched &&
      this.form.controls.password.invalid
    )

  }

}
