/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

export function ifElse (condition: any, trueValue: () => JSX.Element, falseValue: () => JSX.Element) {
    return !!condition ? trueValue() : falseValue()
}

export function ifThen (condition: any, trueValue: () => JSX.Element) {
    return !!condition ? trueValue() : <></>
}

export function forEach <T = any> (array: T[], callback: (value: T, index: number) => JSX.Element) {
    return array.map(callback)
}

export function forEachKey <T = any> (record: Record<string, T>, callback: (value: T, key: string) => JSX.Element) {
    return Object.entries(record).map(([key, value]) => callback(value, key))
}
