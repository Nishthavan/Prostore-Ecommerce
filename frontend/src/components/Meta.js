import React from "react"
import { Helmet } from "react-helmet"

const Meta = ({ title, desc, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={desc} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  )
}
Meta.defaultProps = {
  title: "Welcome to ProStore",
  desc: "We sell best products for cheap",
  keywords: "electronics, buy electronics, cheap electronics",
}

export default Meta
