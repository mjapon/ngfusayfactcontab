import { Injectable } from "@angular/core";
import { TreeNode } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class PrimeTreeUtil {


    expandAll(primetree: any) {

        primetree.forEach(node => {
            this.expandRecursive(node, true);
        });

    }

    collapseAll(primetree: any) {
        primetree.forEach(node => {
            this.expandRecursive(node, false);
        });
    }


    expandRecursive(node: TreeNode, isExpanded: boolean) {
        node.expanded = isExpanded;
        if (node.children) {
            node.children.forEach(childNode => {
                this.expandRecursive(childNode, isExpanded);
            });
        }
    }

    toggleExpand(node: TreeNode) {
        node.expanded = !node.expanded;
    }

}