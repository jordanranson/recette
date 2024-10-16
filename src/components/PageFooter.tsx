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
                                    <a 
                                        key={index} 
                                        className='button button--link text-small'
                                        href={link.link} 
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        {link.text}
                                    </a>
                                ))
                            }
                        </Level>
                    </Block>
                ))
            }
            <Block size='small'>
                powered by <a 
                    className='button button--link text-small'
                    href='https://github.com/jordanranson/recette' 
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Recette
                </a>
            </Block>
        </div>
    )
}
