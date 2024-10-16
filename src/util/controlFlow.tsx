import React from 'react'

export function ifElse (condition: any, trueValue: () => JSX.Element, falseValue: () => JSX.Element) {
    return !!condition ? trueValue() : falseValue()
}

export function ifThen (condition: any, trueValue: () => JSX.Element) {
    return !!condition ? trueValue() : <></>
}

export function forEach (array: any[], callback: (value: any, index: number) => JSX.Element) {
    return array.map(callback)
}

export function forEachKey (record: Record<string, any>, callback: (value: any, key: string) => JSX.Element) {
    return Object.entries(record).map(([key, value]) => callback(value, key))
}
