module.exports = {

    title: 'Ting Notebook',

    description: '3DGS SLAM Deep Learning Notes',

    base: '/Ting-notebook/',

    themeConfig: {

        sidebar: {

            '/3DGS/': [
                {
                    title: '3D Gaussian Splatting',
                    collapsable: false,

                    children: [
                        '',
                        'TEST0-Implicit-Neural-Representation'
                    ]
                }
            ]

        }

    }

}