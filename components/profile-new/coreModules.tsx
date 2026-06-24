import React from 'react'

const CoreModules = ({ coreModules }: { coreModules: string[] }) => {
  return (
    <div>
    <div className="mb-4">
        <div className="flex items-center gap-2">
          {coreModules.length > 0 && (
            <div className="flex items-center gap-2">
              {coreModules.map((module) => (
                <p
                  key={module}
                  className="text-sm font-thin text-black flex items-center gap-2 font-neue"
                >
                  {module}{" "}
                  <span className="bg-black w-2 h-2 rounded-full inline-block"></span>
                </p>
              ))}
            </div>
          )}
          {/* <p className="text-sm font-thin text-black flex items-center gap-2 font-neue">{user?.experience} years of experience</p> */}
        </div>
      </div>
    </div>
  )
}

export default CoreModules;