import { Mosque } from "@/types/Mosque";
import { cva } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

const labelVariants = cva(
	"relative flex flex-col items-center justify-center rounded-lg",
	{
		variants: {
			supportedPayment: {
				duitnow: "bg-[#ED2C67]",
				tng: "bg-[#015ABF]",
				boost: "bg-[#FF3333]",
			},
		},
	},
);

type Props = Pick<Mosque, "qrContent" | "supportedPayments"> & {
	size?: number;
} & ButtonHTMLAttributes<HTMLButtonElement>;


const QrCodeDisplay = forwardRef<HTMLButtonElement, Props>((props, ref) => {
	if (!props.qrContent) {
		console.warn("No QR content provided");
		return null;
	}

	const payment = props.supportedPayments?.split(',')[0];
	
	return (
		<button
			type="button"
			style={{
				width: props.size || 160,
				height: props.size || 160,
				padding: (props.size || 160) * 0.05,
				paddingTop: (props.size || 160) * 0.1,
			}}
			className={cn(
				labelVariants({
					supportedPayment: payment as
						| "duitnow"
						| "tng"
						| "boost"
						| undefined,
				}),
			)}
			onClick={props.onClick}
			ref={ref}
		>
			<div className="bg-white rounded flex flex-col items-center justify-center w-full h-full">
				{payment === "duitnow" && (
					<div
						style={{
							width: (props.size || 160) * 0.2,
							height: (props.size || 160) * 0.2,
						}}
						className="absolute top-0 flex items-center justify-center bg-[#ED2C67] rounded-full border-4 border-white"
					>
						<Image
							src="/icons/duitnow.png"
							fill
							alt="DuitNow"
							className="object-contain"
						/>
					</div>
				)}
				{payment === "tng" && (
					<div
						style={{
							width: (props.size || 160) * 0.2,
							height: (props.size || 160) * 0.2,
						}}
						className="absolute top-0 flex items-center justify-center"
					>
						<Image
							src="/icons/tng.png"
							fill
							alt="TNG"
							className="object-contain"
						/>
					</div>
				)}
				{payment === "boost" && (
					<div
						style={{
							width: (props.size || 160) * 0.2,
							height: (props.size || 160) * 0.2,
						}}
						className="absolute top-0 flex items-center justify-center bg-[#EE2E24] rounded-full border-4 border-white"
					>
						<Image
							src="/icons/boost.png"
							fill
							alt="Boost"
							className="object-contain rounded-full"
						/>
					</div>
				)}
				<QRCodeSVG
					value={props.qrContent}
					level="M"
					size={(props.size || 160) * 0.7}
				/>
			</div>
		</button>
	);
});

QrCodeDisplay.displayName = "QrCodeDisplay";

export default QrCodeDisplay;
