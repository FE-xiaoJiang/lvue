/* @flow */

import { namespaceMap } from '../web/util/element'

export function createElement (tagName, vnode) {
  const elm = document.createElement(tagName)
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple')
  }
  return elm
}

export function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

export function createTextNode (text) {
  return document.createTextNode(text)
}

export function createComment (text) {
  return document.createComment(text)
}

export function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode)
}

export function removeChild (node, child) {
  node.removeChild(child)
}

export function appendChild (node, child) {
  node.appendChild(child)
  return node;
}

export function parentNode (node) {
  return node.parentNode
}

export function nextSibling (node) {
  return node.nextSibling
}

export function tagName (node) {
  return node.tagName
}

export function setTextContent (node, text) {
  node.textContent = text
}

export function _s(text) {
  return text;
}

export function setStyleScope (node, scopeId) {
  node.setAttribute(scopeId, '')
}

// export function genCode(vnode) {
//   let code = '';
//   if (!vnode.unary || !vnode.children.length) {//一元标签或者自元素为空
//     const elm = createElement(vnode.tag);
//   } else {
//     let childCode = '';
//     for(let i = 0; i < vnode.children.length; i++) {
//       childCode = ``;
//     }
//     code = `createElement(${vnode.tag}, )`;
//   }
//   return code;
// }
