import axios from "axios";
const webhookErrorsUrl: string =
  "https://discord.com/api/webhooks/1169709538799263774/q0D0qeoQxv1MSFKbLHOUeG94_qDb4FSjmgUhQNe3chVuk0Z0xGCy9UG0BXSk2dENTxE0";
interface fieldsProps {
  name: string;
  value: string;
  inline: boolean;
}
interface authorProps {
  name: string;
  iconurl?: any;
}

interface embedcreatorprops {
  description?: string;
  title?: string;
  color?: string;
  thumbnail?: string;
  image?: string;
  fields?: fieldsProps[];
  author?: authorProps[];
}

export function embedcreator(props: embedcreatorprops) {
  const embed = {
    title: "",
    description: "",
    color: 0x8300ff,
    author: {
      name: "",
      iconURL: "",
    },
    footer: {
      text: "yTrusk Api",
    },
  };
  if (props.title) embed.title = props.title;
  if (props.description) embed.description = props.description;
  if (props.color) {
    const colorValue = parseInt(props.color, 16);
    if (!isNaN(colorValue)) {
      embed.color = colorValue;
    }
  }
  if (props.author) {
    props.author.forEach((auth) => {
      embed.author.name = auth.name;
      if (auth.iconurl) embed.author.iconURL = auth.iconurl;
    });
  }

  const payload = {
    embeds: [embed],
  };
  return payload;
}
interface catcherrorprops {
  error: any;
  name?: string;
}
export async function catcherror(props: catcherrorprops) {
  const payload = embedcreator({
    title: props.name,
    description: props.error,
    color: "0xFF0000",
  });
  try {
    await axios.post(webhookErrorsUrl, payload);
  } catch {
    console.log("Erro ao enviar log.");
  }
}
