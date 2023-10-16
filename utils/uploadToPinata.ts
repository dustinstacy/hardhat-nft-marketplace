import pinataSDK from '@pinata/sdk'
import path from 'path'
import fs from 'fs'
import 'dotenv/config'

const pinataAPIkey = process.env.PINATA_API_KEY
const pinataAPISecret = process.env.PINATA_API_SECRET
const pinata = new pinataSDK(pinataAPIkey, pinataAPISecret)

export const storeImages = async (imagesFilePath: string) => {
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    let responses = []
    console.log('Uploading to IPFS!')
    for (const fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
        let name = files[fileIndex].replace('.png', '')
        const options = {
            pinataMetadata: {
                name: name,
            },
        }
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile, options)
            responses.push(response)
        } catch (e) {
            console.log(e)
        }
    }
    return { responses, files }
}

export const storeTokenURIMetadata = async (metadata: Object) => {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (e) {
        console.log(e)
    }
}
