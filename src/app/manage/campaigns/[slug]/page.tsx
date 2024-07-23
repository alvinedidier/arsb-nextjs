export default function Page({ params }: { params: { slug: string } }) {
    return <div>Ma Campagne: {params.slug}</div>
  }