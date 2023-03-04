// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Types.
 */
export type ResponseData = {
  companies?: Companies[]
  topDividendYield?: Companies[]
  topGrowth?: Companies[]
  topPVP?: Companies[]
}

export type Companies = {
  nomeEmpresa: string
  cotacao: number
  pl: number
  pvp: number
  divYield: number
  patrimonioLiquido: number
  crescimento: number
}

/**
 * Mongo schema register.
 */
const Schema = mongoose.Schema
const Empresa = new Schema({
  nomeEmpresa: String,
  cotacao: Number,
  pl: Number,
  pvp: Number,
  divYield: Number,
  patrimonioLiquido: Number,
  crescimento: Number
})

mongoose.model('Empresa', Empresa)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  /**
   * Conectando no mongo.
   */
  await mongoose
    .connect(
      'mongodb+srv://andespindola1:Y8b5T6qOmYDUVFXU@crawler.dhivngi.mongodb.net/?retryWrites=true&w=majority'
    )
    .then(() => console.log('Connected!'))

  /**
   * Criando a receita do bolo ( schema )
   */
  const EmpresaModel = mongoose.model('Empresa')

  /**
   * Trazer somente empresas sólidas.
   */
  const response: Companies[] = await EmpresaModel.find({
    divYield: { $lte: 100 }
  }).lean()

  mongoose.disconnect()

  const topDividendYield = getTopDividendYield(response)
  const topPVP = getTopPVP(response)
  const topGrowth = getTopGrowth(response)

  res
    .status(200)
    .json({ topPVP, topGrowth, topDividendYield, companies: response })
}

/**
 * Get top five mothafuck companies.
 */
const getTopDividendYield = (data: Companies[]) => {
  return data.sort((a, b) => (a?.divYield > b?.divYield ? -1 : 1)).slice(0, 10)
}

const getTopPVP = (data: Companies[]) => {
  return data.sort((a, b) => (a?.pvp > b?.pvp ? -1 : 1)).slice(0, 10)
}

const getTopGrowth = (data: Companies[]) => {
  1
  return data
    .sort((a, b) => (a?.crescimento > b?.crescimento ? -1 : 1))
    .slice(0, 10)
}
