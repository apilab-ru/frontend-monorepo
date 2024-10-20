import { Component } from '@angular/core';
import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import { DfInputComponent, DfOutputComponent, DrawFlowBaseNode } from "@ng-draw-flow/core";

@Component({
  selector: 'app-test-node',
  standalone: true,
  imports: [NgIf, DfInputComponent, DfOutputComponent, JsonPipe],
  templateUrl: './test-node.component.html',
  styleUrl: './test-node.component.scss',
})
export class TestNodeComponent extends DrawFlowBaseNode {}
