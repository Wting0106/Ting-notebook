module.exports = {

    title: 'Ting Notebook',

    description: '3DGS SLAM Deep Learning Notes',

    base: '/Ting-notebook/',

    head: [
        [
            'link',
            {
                rel: 'stylesheet',
                href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'
            }
        ]
    ],


    markdown: {
        extendMarkdown: md => {
            md.use(require('markdown-it-katex'))
        }
    },

    themeConfig: {

        sidebar: {

            '/3DGS/': [
                {
                    title: '3D Gaussian Splatting',
                    collapsable: false,

                    children: [
                        '',
                        'TEST0-Implicit-Neural-Representation',
                        '3D_Gaussian'
                    ]
                }
            ]

        }

    }

}