import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editable-textbox',
  templateUrl: './editable-textbox.component.html',
  styleUrls: ['./editable-textbox.component.scss']
})
export class EditableTextboxComponent implements OnInit {
  text = "Hello, I am an editable textarea. Hover and select me to see the editable textbox!"
  constructor() { }

  ngOnInit() {
  }

}