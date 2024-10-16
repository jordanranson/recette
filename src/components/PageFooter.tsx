import './PageFooter.sass'

import React from 'react'
import Block from './Block'
import Level from './Level'
import { forEach, ifThen } from '../../util/controlFlow'

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
                                    <a key={index} href={link.href} className='button button--link text-small'>
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
