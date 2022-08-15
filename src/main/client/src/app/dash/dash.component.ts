import {Component, OnInit, ViewChild} from '@angular/core';

import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDatepickerInputEvent, MatTableDataSource, PageEvent, TooltipPosition} from "@angular/material";
import {DashApiService} from "./dash-api.service";
import {MatPaginator} from "@angular/material/paginator";

export interface Actor {
  id: number;
  firstName: string;
  lastName: string;
  lastUpdate: string;
}

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'lastUpdate', 'action'];

  dataSource = new MatTableDataSource<any>();

  isLoading = true;

  pageNumber: number = 1;
  formGroup!: FormGroup;
  isEditableNew: boolean = true;
  paginatorList!: HTMLCollectionOf<Element>;
  idx: number = -1;

  constructor(
    private dashService: DashApiService,
    private fb: FormBuilder,
    private _formBuilder: FormBuilder){}

  ngOnInit(): void {

    this.formGroup = this._formBuilder.group({
      VORows: this._formBuilder.array([])
    });

    this.dashService.getActorData().subscribe((data)=>{

      this.formGroup = this.fb.group({
        VORows: this.fb.array(data.actors.map((val: Actor) => this.fb.group({
            id: new FormControl(val.id),
            firstName: new FormControl(val.firstName),
            lastName: new FormControl(val.lastName),
            lastUpdate: new FormControl(val.lastUpdate),
            isEditable: new FormControl(true),
            isNewRow: new FormControl(false),
          })
        )) //end of fb array
      }); // end of form group cretation
      this.dataSource = new MatTableDataSource((this.formGroup.get('VORows') as FormArray).controls);
      this.dataSource.paginator = this.paginator;
      const filterPredicate = this.dataSource.filterPredicate;
      this.dataSource.filterPredicate = (data: AbstractControl, filter) => {
        return filterPredicate.call(this.dataSource, data.value, filter);
      }

    });

    this.isLoading = false;
    this.dataSource = new MatTableDataSource((this.formGroup.get('VORows') as FormArray).controls);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginatorList = document.getElementsByClassName('mat-paginator-range-label');

    this.onPaginateChange(this.paginator, this.paginatorList);

    this.paginator.page.subscribe(() => { // this is page change event
      this.onPaginateChange(this.paginator, this.paginatorList);
    });
  }

  onPaginateChange(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
    setTimeout(() => {
      let from = (paginator.pageSize * paginator.pageIndex) + 1;

      let to = (paginator.length < paginator.pageSize * (paginator.pageIndex + 1))
        ? paginator.length
        : paginator.pageSize * (paginator.pageIndex + 1);

      let toFrom = (paginator.length == 0) ? 0 : `${from} - ${to}`;
      let pageNumber = (paginator.length == 0) ? `0 of 0` : `${paginator.pageIndex + 1} of ${paginator.getNumberOfPages()}`;
      let rows = `Page ${pageNumber} (${toFrom} of ${paginator.length})`;

      if (list.length >= 1)
        list[0].innerHTML = rows;

    }, 0, paginator.pageIndex);
  }

  applyFilter(event: Event) {
    //  debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addNewRow() {
    const control = this.formGroup.get('VORows') as FormArray;
    control.insert(0,this.initiateVOForm());
    this.dataSource = new MatTableDataSource(control.controls)
  }

  // this function will enabled the select field for editd
  editSVO(rowFormGroup: any, i: number) {

    // VOFormElement.get('VORows').at(i).get('name').disabled(false)
    rowFormGroup.get('VORows').at(i).get('isEditable').patchValue(false);
    // this.isEditableNew = true;

  }

  // On click of correct button in table (after click on edit) this method will call
  saveVO(rowFormGroup: any, i: number) {
    // alert('saveVO')
    rowFormGroup.get('VORows').at(i).get('isEditable').patchValue(true);
    const controls = rowFormGroup.get('VORows').at(i).controls;
    console.log(rowFormGroup.get('VORows').at(i));
    const body = {
      id: controls.id.value,
      firstName: controls.firstName.value,
      lastName: controls.lastName.value,
    }
    this.dashService.save(body).subscribe((response) => {
      setTimeout(() => {
          console.log("1",rowFormGroup.get('VORows').at(i).get('lastUpdate').value);
          rowFormGroup.get('VORows').at(i).get('lastUpdate').setValue(response.data.lastUpdate);
          console.log("2",rowFormGroup.get('VORows').at(i).get('lastUpdate').value);
        //
        //
        //
        // console.log(response.data.lastUpdate);
        // apply the results to the form control
      });
    });
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  cancelSVO(rowFormGroup: any, i: number) {
    rowFormGroup.get('VORows').at(i).get('isEditable').patchValue(true);
  }

  initiateVOForm(): FormGroup {
    return this.fb.group({

      id: new FormControl(234),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
    });
  }

  goToPage() {
    this.paginator.pageIndex = this.pageNumber - 1;
    this.paginator.page.next({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length
    });
  }




}
