import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import cytoscape from 'cytoscape';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'try-cytoscape';
  cytoScapeContainer: any;
  document: any;
  selectedNode: any;

  constructor(@Inject(DOCUMENT) document) {
    this.document = document;
  }

  ngOnInit(): void {
    this.cytoScapeContainer = cytoscape({
      container: this.document.getElementById('cy'), // container to render in
      elements: [],

      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            label: 'data(id)',
          },
        },

        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],

      layout: {
        name: 'grid',
        rows: 3,
      },
    });
    this.cytoScapeContainer.on('cxttap', 'node', (evt) => {
      var node = evt.target;
      this.selectedNode = node.id();
    });
    this.cytoScapeContainer.on('tap', 'node', (evt) => {
      var node = evt.target;
      const destNode = node.id();
      const srcNode = this.selectedNode;
      this.addEdge(srcNode, destNode);
    });
  }

  addEdge(srcNode, destNode) {
    this.cytoScapeContainer.add([
      {
        data: { source: srcNode, target: destNode },
      },
    ]);
  }

  addNode(xPosition, yPosition) {
    this.cytoScapeContainer.add([
      {
        group: 'nodes',
        data: { weight: 10, name: 'hello' },
        position: { x: xPosition + 100, y: yPosition },
      },
    ]);
  }

  dragstart_handler(ev) {
    ev.dataTransfer.setData('text/plain', ev.target.id);
    ev.dataTransfer.dropEffect = 'copy';
    console.log(ev.target);
  }

  drop_handler(ev) {
    ev.preventDefault();
    this.addNode(ev.x, ev.y);
  }

  dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
  }
}
