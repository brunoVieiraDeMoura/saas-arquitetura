import { Node, nodePasteRule } from '@tiptap/core'

// Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID
const YOUTUBE_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?[^#\s]*v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g

export function extractYoutubeId(url: string): string | null {
  YOUTUBE_REGEX.lastIndex = 0
  const match = YOUTUBE_REGEX.exec(url)
  return match ? match[1] : null
}

const YoutubeEmbed = Node.create({
  name: 'youtubeEmbed',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      videoId: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-youtube-id]',
        getAttrs: (dom) => ({
          videoId: (dom as HTMLElement).getAttribute('data-youtube-id'),
        }),
      },
    ]
  },

  renderHTML({ node }) {
    return [
      'div',
      {
        'data-youtube-id': node.attrs.videoId,
        style:
          'position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:1em 0;',
      },
      [
        'iframe',
        {
          src: `https://www.youtube.com/embed/${node.attrs.videoId}`,
          style:
            'position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:8px;',
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          allowfullscreen: 'true',
          frameborder: '0',
        },
      ],
    ]
  },

  addNodeView() {
    return ({ node }) => {
      // Outer limits width in the editor canvas
      const outer = document.createElement('div')
      outer.style.cssText = 'margin:1em auto;max-width:480px;'

      // Inner uses padding-bottom trick relative to outer (480px), not the editor container
      const inner = document.createElement('div')
      inner.style.cssText =
        'position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;'

      const iframe = document.createElement('iframe')
      iframe.src = `https://www.youtube.com/embed/${node.attrs.videoId}`
      iframe.style.cssText =
        'position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:8px;'
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      iframe.allowFullscreen = true

      inner.appendChild(iframe)
      outer.appendChild(inner)
      return { dom: outer }
    }
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: new RegExp(YOUTUBE_REGEX.source, 'g'),
        type: this.type,
        getAttributes: (match) => ({ videoId: match[1] }),
      }),
    ]
  },
})

export default YoutubeEmbed
