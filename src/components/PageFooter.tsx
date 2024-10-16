import React from 'react'

import { forEach, ifThen } from '@/util/controlFlow'

import Block from './Block'
import Level from './Level'

interface PageFooterProps {
    config: RecetteConfig
}

export default function PageFooter (props: PageFooterProps) {
    return (
        <div className='PageFooter'>
            {
                ifThen(props.config.template.footerLinks && props.config.template.footerLinks.length, () => (
                    <Block size='small'>
                        <Level size='small'>
                            {
                                forEach(props.config.template.footerLinks, (link, index) => (
                                    <a key={index} href={link.link} className='button button--link text-small'>
                                        {link.text}
                                    </a>
                                ))
                            }
                        </Level>
                    </Block>
                ))
            }
            <Block size='small'>
                powered by <a href='#' className='button button--link text-small'>Recette</a>
            </Block>
        </div>
    )
}
