import React, { useEffect, useState } from 'react'
import { Environment } from 'wailsjs/runtime'
import { envType } from '@/types/env'
import {
  settingConfigType,
  SETTING_CONFIG_ENUM,
  USER_CONFIG_ENUM,
} from '@/types/config'
import {
  Box,
  Card,
  Flex,
  Separator,
  Switch,
  Button,
  Tooltip,
} from '@radix-ui/themes'
import {
  ChevronRightIcon,
  ExitIcon,
  QuestionMarkCircledIcon,
  SymbolIcon,
} from '@radix-ui/react-icons'
import {
  APP_NAME,
  APP_VERSION,
  ReadConfig,
  UpdateConfig,
  Storage,
  ShowMessageDialog,
  DialogType,
} from '@/utils'
import { getUserPreference, updateUserPreference } from '@/api/user'
import { useNavigateTo } from '@/hooks'
import APP_ICON from '@/assets/images/logo.png'
import {
  userType,
  userPreferenceType,
  USER_PREFERENCE_ENUM,
} from '@/types/user'
import { BlockedModal } from './components/blockedModal'
import './index.modules.scss'
import { CONSTANT } from '@/types/constant'

export const Setting: React.FC = () => {
  const [envInfo, setEnvInfo] = useState<envType>()
  const [config, setConfig] = useState<settingConfigType>({
    checkUpdateOnStartup: false,
    isIpLocHidden: false,
  })
  const [preferenceLists, setPreferenceLists] = useState<userPreferenceType>({
    isRecentPlayedHidden: false,
    isListenMileageHiddenInComment: false,
    isStickerLibraryHidden: false,
    isStickerBoardHidden: false,
    rejectHotPush: false,
    rejectRecommendation: false,
  })
  const userInfo: userType = Storage.get('user_info')
  const [blockedModal, setBlockedModal] = useState<boolean>(false)

  const goAbout = useNavigateTo('/about')
  const goLogin = useNavigateTo('/login')

  const checkUpdate = () => {
    // TODO:  check update
  }

  /**
   * 退出登录
   */
  const logout = () => {
    ShowMessageDialog(DialogType.QUESTION, '提示', '确定要退出登录吗？').then(
      async (res) => {
        if (res === 'Yes' || res === '是') {
          try {
            await Promise.all([
              UpdateConfig(USER_CONFIG_ENUM.accessToken, '').then(),
              UpdateConfig(USER_CONFIG_ENUM.refreshToken, '').then(),
            ])

            Storage.clear()
            goLogin()
            // TODO: 停止播放
          } catch (err) {
            console.error(err)
          }
        }
      },
    )
  }

  /**
   * 获取用户偏好设置
   */
  const onGetUserPreference = () => {
    getUserPreference()
      .then((res) => setPreferenceLists({ ...res.data.data }))
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * 更新用户偏好设置
   * @param type 类型
   * @param flag 状态
   */
  const onUpdateUserPreference = (type: string, flag: boolean) => {
    const params = {
      type,
      flag,
    }

    updateUserPreference(params)
      .then((res) => setPreferenceLists({ ...res.data.data }))
      .catch((err) => {
        console.log(err)
      })
  }

  const onUpdateConfig = (key: string, value: any) => {
    UpdateConfig(key, value).then()
  }

  useEffect(() => {
    Environment().then((res: envType) => {
      setEnvInfo(res)
    })

    onGetUserPreference()

    ReadConfig()
      .then((res) => {
        setConfig(res.setting)
      })
      .catch((err) => {
        console.error('error', err)
      })
  }, [])

  return (
    <div className="setting-layout">
      <h3>设置</h3>

      <h4>账号绑定</h4>
      <Card>
        <Flex>
          <Box width="100%">手机号</Box>
          <Box className="content_text">{userInfo.mobilePhoneNumber}</Box>
        </Flex>
        {userInfo.wechatUserInfo?.nickName && (
          <>
            <Separator
              my="3"
              size="4"
            />
            <Flex>
              <Box width="100%">微信</Box>
              <Box className="content_text">
                {userInfo.wechatUserInfo?.nickName}
              </Box>
            </Flex>
          </>
        )}

        {userInfo.jikeUserInfo?.nickname && (
          <>
            <Separator
              my="3"
              size="4"
            />
            <Flex>
              <Box width="100%">即刻</Box>
              <Box className="content_text">
                {userInfo.jikeUserInfo?.nickname}
              </Box>
            </Flex>
          </>
        )}
      </Card>

      <h4>隐私设置</h4>
      <Card>
        <Flex>
          <Box width="100%">{CONSTANT.RECENT_PLAYED_HIDDEN}</Box>
          <Box>
            <Switch
              checked={preferenceLists.isRecentPlayedHidden}
              onCheckedChange={(checked) => {
                onUpdateUserPreference(
                  USER_PREFERENCE_ENUM.isRecentPlayedHidden,
                  checked,
                )
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">{CONSTANT.LISTEN_MILEAGE_HIDDEN_IN_COMMENT}</Box>
          <Box>
            <Switch
              checked={preferenceLists.isListenMileageHiddenInComment}
              onCheckedChange={(checked) => {
                onUpdateUserPreference(
                  USER_PREFERENCE_ENUM.isListenMileageHiddenInComment,
                  checked,
                )
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">{CONSTANT.STICKER_LIBRARY_HIDDEN}</Box>
          <Box>
            <Switch
              checked={preferenceLists.isStickerLibraryHidden}
              onCheckedChange={(checked) => {
                onUpdateUserPreference(
                  USER_PREFERENCE_ENUM.isStickerLibraryHidden,
                  checked,
                )
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">{CONSTANT.STICKER_BOARD_HIDDEN}</Box>
          <Box>
            <Switch
              checked={preferenceLists.isStickerBoardHidden}
              onCheckedChange={(checked) => {
                onUpdateUserPreference(
                  USER_PREFERENCE_ENUM.isStickerBoardHidden,
                  checked,
                )
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">{CONSTANT.REJECT_HOT_PUSH}</Box>
          <Box>
            <Switch
              checked={preferenceLists.rejectHotPush}
              onCheckedChange={(checked) => {
                onUpdateUserPreference(
                  USER_PREFERENCE_ENUM.rejectHotPush,
                  checked,
                )
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">{CONSTANT.REJECT_RECOMMEND_ACTION}</Box>
          <Box>
            <Switch
              checked={preferenceLists.rejectRecommendation}
              onCheckedChange={(checked) => {
                onUpdateUserPreference(
                  USER_PREFERENCE_ENUM.rejectRecommendation,
                  checked,
                )
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">
            {CONSTANT.IP_LOC_HIDDEN}
            <Tooltip content="关闭后将不显示自己与他人的 IP 属地信息">
              <QuestionMarkCircledIcon
                style={{
                  marginLeft: '6px',
                  cursor: 'help',
                }}
              />
            </Tooltip>
          </Box>
          <Box>
            <Switch
              checked={config?.isIpLocHidden}
              onCheckedChange={(checked: boolean) => {
                setConfig({
                  ...config,
                  isIpLocHidden: checked,
                })
                onUpdateConfig(SETTING_CONFIG_ENUM.isIpLocHidden, checked)
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setBlockedModal(true)
          }}
        >
          <Box width="100%">
            小黑屋
            <Tooltip content="已拉黑的用户">
              <QuestionMarkCircledIcon
                style={{
                  marginLeft: '6px',
                  cursor: 'help',
                }}
              />
            </Tooltip>
          </Box>
          <Box>
            <ChevronRightIcon />
          </Box>
        </Flex>
      </Card>

      <h4>其他</h4>
      <Card>
        <Flex>
          <Box width="100%">软件更新</Box>
          <Box>
            <Button
              size={'1'}
              variant={'soft'}
              style={{ width: '100px' }}
              onClick={checkUpdate}
            >
              <SymbolIcon />
              检查更新...
            </Button>
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">启动时检查更新</Box>
          <Box>
            <Switch
              checked={config?.checkUpdateOnStartup}
              onCheckedChange={(checked: boolean) => {
                setConfig({
                  ...config,
                  checkUpdateOnStartup: checked,
                })
                onUpdateConfig(
                  SETTING_CONFIG_ENUM.checkUpdateOnStartup,
                  checked,
                )
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex
          style={{ cursor: 'pointer' }}
          onClick={goAbout}
        >
          <Box width="100%">关于</Box>
          <Box>
            <ChevronRightIcon />
          </Box>
        </Flex>
      </Card>

      <h4>账户</h4>
      <Card>
        <Flex>
          <Box width="100%">登出</Box>
          <Box>
            <Button
              size={'1'}
              variant="soft"
              style={{ width: '100px' }}
              onClick={() => {
                logout()
              }}
              color="red"
            >
              <ExitIcon /> 退出登录
            </Button>
          </Box>
        </Flex>
      </Card>

      <div className="app-logo">
        <div className="logo">
          <img
            src={APP_ICON}
            alt="app_icon"
          />
        </div>
      </div>

      <div className="app-info">
        <div>{APP_NAME}</div>
        <p>
          v{APP_VERSION}_{envInfo?.platform}_{envInfo?.arch}
        </p>
      </div>

      <BlockedModal
        open={blockedModal}
        onClose={() => {
          setBlockedModal(false)
        }}
      />
    </div>
  )
}
