import {RouterModule, Routes} from "@angular/router";
import {DashComponent} from "./dash/dash.component";
import {NgModule} from "@angular/core";


const routes: Routes = [
  { path: 'dash', component: DashComponent},
  { path: '**', redirectTo : 'dash'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      useHash: true,  // allows for grails to ignore these
      enableTracing: false, // When true, log all internal navigation events to the console. Use for debugging.
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled'  // will be default eventually > Angular 13
    }
  )
  ],
})

export class AppRoutingModule { }

